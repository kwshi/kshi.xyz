import * as Path from "path";
import * as Fs from "fs/promises";

import Git from "nodegit";

import * as Chalk from "chalk";

import * as Unified from "unified";
import * as ToVFile from "to-vfile";

import type * as Vite from "vite";

export interface PluginOptions {
  alias: string;
  root: string;
  extensions: string[];
  processor: Unified.FrozenProcessor;
}

export interface Timestamp {
  modified?: number;
  added: number;
}

export interface Metadata<Data> {
  segments: string[];
  timestamp?: Timestamp;
  data: Data;
}

const walk = (path: string) => {
  const go = async function* (
    path: string,
    prefix: string[]
  ): AsyncGenerator<{ path: string; prefix: string[] }, void, void> {
    if ((await Fs.lstat(path)).isDirectory())
      for (const name of await Fs.readdir(path))
        yield* go(Path.join(path, name), [...prefix, name]);
    else {
      const last = prefix.pop()!;
      const base = Path.basename(last, Path.extname(last));
      yield base === "index"
        ? { path, prefix }
        : { path, prefix: [...prefix, base] };
    }
  };

  return go(path, []);
};

/**
 * Get latest create/add & modify dates of `path` in Git history. Returns `null`
 * if file is untracked/staged (i.e., not in the commit tree).
 */
const getTimestamp = async (
  repo: Git.Repository,
  commit: Git.Commit,
  path: string
): Promise<Timestamp | undefined> => {
  for (let count = 2, curr = path; ; count <<= 1) {
    const walker = repo.createRevWalk();
    walker.sorting(Git.Revwalk.SORT.TIME);
    walker.push(commit.id());

    const walk = await walker.fileHistoryWalk(curr, count);

    if (walk.length === 0) return;

    for (let i = 0, modified: Date | null = null; i < walk.length; ++i)
      switch (walk[i].status) {
        case Git.Diff.DELTA.MODIFIED:
          modified = walk[i].commit.date();
          continue;
        case Git.Diff.DELTA.ADDED:
          return {
            modified: modified?.getTime(),
            added: walk[i].commit.date().getTime(),
          };
        case Git.Diff.DELTA.RENAMED:
          curr = walk[i].oldName;
      }
  }
};

const getData = async (
  processor: Unified.FrozenProcessor,
  path: string
): Promise<unknown> => {
  const file = await processor.process(await ToVFile.read(path));
  for (const msg of file.messages)
    console.error(Chalk.chalkStderr.redBright(msg));
  return file.data;
};

const searchPosts = async (
  options: PluginOptions
): Promise<Metadata<unknown>[]> => {
  const repoPath = await Git.Repository.discover(".", 1, "/");
  const repo = await Git.Repository.open(repoPath);
  const commit = await repo.getHeadCommit();

  const entries: Metadata<unknown>[] = [];
  for await (const post of walk(options.root)) {
    if (!options.extensions.includes(Path.extname(post.path))) continue;

    const [data, timestamp] = await Promise.all([
      getData(options.processor, Path.relative(".", post.path)),
      getTimestamp(repo, commit, post.path),
    ]);
    entries.push({ data, timestamp, segments: post.prefix });
  }
  return entries;
};

export default (options: PluginOptions): Vite.Plugin => {
  return {
    name: "posts",
    configureServer: (server) => {
      // TODO: incremental updates based on `add`/`unlink`/`change`; for now,
      // we do the easy thing, which is to simply re-index everything on any
      // change

      // TODO: also auto HMR updates, possibly, by transforming the posts
      // importer; for now, just trigger full reload

      const refresh = (path: string) => {
        // ignore if outside `root`
        if (Path.relative(options.root, path).startsWith("../")) return;

        // cache-invalidation code taken from vite-plugin-pages; see end of
        // this source file for links
        const mod = server.moduleGraph.getModuleById(`\0${options.alias}`);
        if (typeof mod !== "undefined")
          server.moduleGraph.invalidateModule(mod);

        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", refresh);
      server.watcher.on("unlink", refresh);
      server.watcher.on("change", refresh);
    },
    resolveId: (src) => (src === options.alias ? `\0${options.alias}` : null),
    load: async (src) => {
      if (src !== `\0${options.alias}`) return null;

      const contents = await searchPosts(options);
      return `export default ${JSON.stringify(contents)}`;
    },
  };
};

// links to vite-plugin-pages code for invalidating module cache
// <https://github.com/hannoeru/vite-plugin-pages/blob/39892da3dd6aaa4ba627f778c14e6aacf4206a38/src/context.ts#L52>
// <https://github.com/hannoeru/vite-plugin-pages/blob/39892da3dd6aaa4ba627f778c14e6aacf4206a38/src/utils.ts#L66>
