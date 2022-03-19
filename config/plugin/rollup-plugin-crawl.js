// @ts-check

import * as Path from "path";
import { promises as Fs } from "fs";

import Git from "nodegit";

import Toml from "@iarna/toml";
import Chalk from "chalk";

import remark from "remark";
import * as ToVFile from "to-vfile";

import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkExtractFrontmatter from "remark-extract-frontmatter";

import remarkSmartypants from "@silvenon/remark-smartypants";

import remarkExtractHeadings from "./remark-extract-headings.js";
import remarkExtractIntro from "./remark-extract-intro.js";
import remarkValidateFrontmatter from "./remark-validate-frontmatter.js";

/**
 * @type {(
 *   path: string,
 *   prefix?: string[]
 * ) => AsyncGenerator<{ path: string; prefix: string[] }, void, void>}
 */
const crawl = async function* (path, prefix = []) {
  if ((await Fs.lstat(path)).isDirectory())
    for (const name of await Fs.readdir(path))
      yield* crawl(Path.join(path, name), [...prefix, name]);
  else {
    const last = prefix.pop();
    const base = Path.basename(last, Path.extname(last));
    yield base === "index"
      ? { path, prefix }
      : { path, prefix: [...prefix, base] };
  }
};

/**
 * @type {(args: {
 *   repo: Git.Repository;
 *   commit: Git.Oid;
 *   path: string;
 * }) => Promise<{ modified: Date; added: Date }>}
 */
const getTimeline = async ({ repo, commit, path }) => {
  for (let count = 2, i = 0, modified; ; count <<= 1) {
    const walker = repo.createRevWalk();
    walker.sorting(Git.Revwalk.SORT.TIME);
    walker.push(commit);

    const walk = await walker.fileHistoryWalk(path, count);
    for (; i < walk.length; ++i)
      switch (walk[i].status) {
        case Git.Diff.DELTA.MODIFIED:
          modified = walk[i].commit.date();
          continue;
        case Git.Diff.DELTA.ADDED:
          return { modified, added: walk[i].commit.date() };
        case Git.Diff.DELTA.RENAMED:
          path = walk[i].oldName;
      }
  }
};

/**
 * @type {(args: {
 *   repo: Git.Repository;
 *   commit: Git.Oid;
 *   path: string;
 *   prefix: string[];
 * }) => Promise<{}>}
 */
const read = async ({ repo, commit, path, prefix }) => {
  const file = await remark()
    .use(remarkFrontmatter, ["toml"])
    .use(remarkExtractFrontmatter, { name: "frontmatter", toml: Toml.parse })
    .use(remarkValidateFrontmatter)
    .use(remarkSmartypants, { dashes: "oldschool", backticks: true })
    .use(remarkMath)
    .use(remarkExtractHeadings)
    .use(remarkExtractIntro)
    .process(await ToVFile.read(path));
  for (const msg of file.messages) console.error(Chalk.stderr.redBright(msg));

  const timeline = await getTimeline({ repo, commit, path });
  if (!timeline)
    console.error(
      Chalk.stderr.redBright(`Failed to get Git timeline for ${path}`)
    );

  return { data: file.data, prefix, timeline };
};

/**
 * @type {(opts: {
 *   alias: string;
 *   extensions: string[];
 * }) => import("rollup").Plugin}
 */
const plugin = ({ alias, extensions }) => ({
  name: "crawl",
  resolveId: (src, importer) =>
    src === alias ? `\0posts:${Path.dirname(importer)}` : null,
  async load(src) {
    if (!src.startsWith("\0posts:")) return null;
    const path = src.slice("\0posts:".length);

    const repo = await Git.Repository.open(".");
    const commit = (await repo.getHeadCommit()).id();

    const contents = [];
    for await (const post of crawl(path))
      if (extensions.includes(Path.extname(post.path)))
        contents.push(
          await read({
            repo,
            commit,
            path: Path.relative(".", post.path),
            prefix: post.prefix,
          })
        );
    return `export default ${JSON.stringify(contents)}`;
  },
});

export default plugin;
