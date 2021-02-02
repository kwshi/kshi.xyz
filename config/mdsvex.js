import { mdsvex } from "mdsvex";

import remarkMath from "remark-math";
import remarkGithub from "remark-github";
import remarkFootnotes from "remark-footnotes";
import remarkToc from "remark-toc";
import remarkSlug from "remark-slug";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import rehypeKatexSvelte from "rehype-katex-svelte";

import rehypeAutolinkHeadings from "rehype-autolink-headings";

import rehypeBaseWorkaround from "./preprocess/rehype-base-workaround";

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
    [remarkToc, { tight: true }],
    remarkSlug,
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
        return Toml.parse(frontmatter);
      } catch (e) {
        messages.push(
          `Parsing error on line ${e.line}, column ${e.column}: ${e.message}`
        );
      }
    },
  },
});
