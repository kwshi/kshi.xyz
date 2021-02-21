import * as Path from "path";
import { promises as Fs } from "fs";

import Toml from "@iarna/toml";
import Chalk from "chalk";

import remark from "remark";
import ToVFile from "to-vfile";

import remarkFrontmatter from "remark-frontmatter";
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

const read = async ({ path, prefix }) => {
  const file = await remark()
    .use(remarkFrontmatter, ["toml"])
    .use(remarkExtractFrontmatter, { name: "frontmatter", toml: Toml.parse })
    .use(remarkValidateFrontmatter)
    .use(remarkSmartypants, { dashes: 'oldschool', backticks: true })
    .use(remarkExtractHeadings)
    .use(remarkExtractIntro)
    .process(await ToVFile.read(path));
  for (const msg of file.messages) console.error(Chalk.stderr.redBright(msg));
  return { prefix, data: file.data };
};

export default ({ alias, extensions }) => ({
  resolveId: (src, importer) =>
    src === alias ? Path.join(Path.dirname(importer), alias) : null,
  async load(src) {
    if (Path.basename(src) !== alias) return null;

    const dir = Path.dirname(src);

    const contents = [];
    for await (const post of crawl(dir))
      if (extensions.includes(Path.extname(post.path)))
        contents.push(await read(post));
    return `export default ${JSON.stringify(contents)}`;
  },
});
