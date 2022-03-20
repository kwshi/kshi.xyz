import { mdsvex } from "mdsvex";

import * as Path from "path";
import * as Url from "url";

import remarkMath from "remark-math-old";
import remarkGithub from "remark-github";
import remarkFootnotes from "remark-footnotes";
import remarkToc from "remark-toc";
import remarkSlug from "remark-slug";
import remarkEmoji from "remark-emoji";
//import rehypeKatex from "rehype-katex";
import rehypeKatexSvelte from "rehype-katex-svelte";

import rehypeAutolinkHeadings from "rehype-autolink-headings";

import remarkInjectToc from "./plugin/remark-inject-toc.js";
import rehypeBaseWorkaround from "./plugin/rehype-base-workaround.js";
import remarkGlobalToc from "./plugin/remark-global-toc.js";

import VMessage from "vfile-message";

import * as Toml from "@iarna/toml";
import Chalk from "chalk";

// - plugin to generate TOC as sidebar
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const katexMacros = {
  ...Object.fromEntries(
    Array.from(letters).map((c) => [`\\${c}${c}`, `\\mathbb{${c}}`])
  ),
  "\\dif": "\\operatorname d\\!",
  "\\pdif": "\\operatorname \\partial\\!",
};

export default mdsvex({
  extensions: [".svx"],
  smartypants: {
    dashes: "oldschool",
    backticks: true,
  },
  remarkPlugins: [
    remarkGithub,
    remarkMath,
    remarkFootnotes,
    remarkEmoji,
    remarkGlobalToc,
    remarkSlug,
  ],
  rehypePlugins: [
    rehypeAutolinkHeadings,
    [rehypeKatexSvelte, { macros: katexMacros }],
    rehypeBaseWorkaround,
    () => (_, file) => {
      for (const msg of file.messages)
        console.error(Chalk.stderr.redBright(msg.toString()));
    },
  ],
  //layout: Path.join(
  //  Path.dirname(Url.fileURLToPath(import.meta.url)),
  //  "../src/components/Mdsvex.svelte"
  //),
  frontmatter: {
    marker: "+",
    type: "toml",
    parse(frontmatter, messages) {
      try {
        Toml.parse(frontmatter);
      } catch (err) {
        messages.push(new VMessage("Failed to parse frontmatter"));
      }
    },
  },
});
