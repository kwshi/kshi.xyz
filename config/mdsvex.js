import { mdsvex } from "mdsvex";

import remarkMath from "remark-math";
import remarkGithub from "remark-github";
import remarkFootnotes from "remark-footnotes";
import remarkToc from "remark-toc";
import remarkSlug from "remark-slug";
import remarkEmoji from "remark-emoji";
//import rehypeKatex from "rehype-katex";
import rehypeKatexSvelte from "rehype-katex-svelte";

import rehypeAutolinkHeadings from "rehype-autolink-headings";

import remarkInjectToc from "./plugin/remark-inject-toc";
import rehypeBaseWorkaround from "./plugin/rehype-base-workaround";

import VMessage from "vfile-message";

import Toml from "@iarna/toml";

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
  smartypants: {
    dashes: "oldschool",
  },
  remarkPlugins: [
    remarkGithub,
    remarkMath,
    remarkFootnotes,
    remarkEmoji,
    remarkInjectToc,
    [remarkToc, { tight: true }],
    remarkSlug,
    () => (_, file) => {
      file.message("OY, please pay attention to me");
    },
    () => (_, file) => {
      for (const msg of file.messages) console.error(msg.toString());
    },
  ],
  rehypePlugins: [
    rehypeAutolinkHeadings,
    [rehypeKatexSvelte, { macros: katexMacros }],
    rehypeBaseWorkaround,
  ],
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
