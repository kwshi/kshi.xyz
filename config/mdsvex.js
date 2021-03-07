const { mdsvex } = require("mdsvex");

const Path = require("path");

const remarkMath = require("remark-math-old");
const remarkGithub = require("remark-github");
const remarkFootnotes = require("remark-footnotes");
const remarkToc = require("remark-toc");
const remarkSlug = require("remark-slug");
const remarkEmoji = require("remark-emoji");
//import rehypeKatex from "rehype-katex";
const rehypeKatexSvelte = require("rehype-katex-svelte");

const rehypeAutolinkHeadings = require("rehype-autolink-headings");

const remarkInjectToc = require("./plugin/remark-inject-toc");
const rehypeBaseWorkaround = require("./plugin/rehype-base-workaround");
const remarkGlobalToc = require("./plugin/remark-global-toc");

const VMessage = require("vfile-message");

const Toml = require("@iarna/toml");
const Chalk = require("chalk");

// - plugin to generate TOC as sidebar
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const katexMacros = {
  ...Object.fromEntries(
    Array.from(letters).map((c) => [`\\${c}${c}`, `\\mathbb{${c}}`])
  ),
  "\\dif": "\\operatorname d\\!",
  "\\pdif": "\\operatorname \\partial\\!",
};

module.exports = mdsvex({
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
  layout: Path.join(__dirname, "../src/components/Mdsvex.svelte"),
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
