import * as Path from "path";
import { promises as Fs } from "fs";

import * as Git from 'nodegit';

import Toml from "@iarna/toml";
import Chalk from "chalk";

import remark from "remark";
import ToVFile from "to-vfile";

import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkSmartypants from "@silvenon/remark-smartypants";

import remarkExtractHeadings from "./remark-extract-headings";
import remarkExtractIntro from "./remark-extract-intro";
import remarkValidateFrontmatter from "./remark-validate-frontmatter";

const crawl = async function*(path, prefix = []) {
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
          break;
        case Git.Diff.DELTA.ADDED:
          return { modified, added: walk[i].commit.date() };
        case Git.Diff.DELTA.RENAMED:
          path = walk[i].oldName;
      }
    if (walk.reachedEndOfHistory) return;
  }
}

const read = async ({ repo, commit, path, prefix }) => {
  const file = await remark()
    .use(remarkFrontmatter, ["toml"])
    .use(remarkExtractFrontmatter, { name: "frontmatter", toml: Toml.parse })
    .use(remarkValidateFrontmatter)
    .use(remarkSmartypants, { dashes: 'oldschool', backticks: true })
    .use(remarkMath)
    .use(remarkExtractHeadings)
    .use(remarkExtractIntro)
    .process(await ToVFile.read(path));
  for (const msg of file.messages) console.error(Chalk.stderr.redBright(msg));

  const timeline = await getTimeline({ repo, commit, path });
  if (!timeline) console.error(Chalk.stderr.redBright(
    `Failed to get Git timeline for ${path}`
  ));

  return { data: file.data, prefix, timeline };
};

export default ({ alias, extensions }) => ({
  resolveId: (src, importer) =>
    src === alias ? Path.join(Path.dirname(importer), alias) : null,
  async load(src) {
    if (Path.basename(src) !== alias) return null;

    const repo = await Git.Repository.open('.');
    const commit = (await repo.getHeadCommit()).id();

    const contents = [];
    for await (const post of crawl(Path.dirname(src)))
      if (extensions.includes(Path.extname(post.path)))
        contents.push(await read({
          repo,
          commit,
          path: Path.relative('.', post.path),
          prefix: post.prefix,
        }));
    return `export default ${JSON.stringify(contents)}`;
  },
});
