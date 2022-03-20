// @ts-check
import svPreprocess from "svelte-preprocess";
import mdsvex from "./config/mdsvex.js";
import adapter from "@sveltejs/adapter-netlify";

import * as Path from "path";
import * as Url from "url";

import * as Remark from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkPostsFrontmatter from "remark-posts-frontmatter";
import vitePosts from "vite-plugin-posts";

import * as Toml from '@iarna/toml'

const dir = Path.dirname(Url.fileURLToPath(import.meta.url));

/** @type {(path: string) => string} */
const abs = (path) => Path.join(dir, path);

/** @type {import("@sveltejs/kit").Config} */
const config = {
  extensions: [".svx", ".svelte"],
  preprocess: [
    mdsvex,
    svPreprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: adapter(),

    vite: {
      resolve: {
        alias: {
          $components: abs("src/components"),
        },
      },
      plugins: [
        vitePosts({
          root: "src/routes/ramblings",
          alias: "virtual:posts",
          extensions: [".svx"],
          processor: Remark.remark()
            .use(remarkFrontmatter, ["toml"])
            .use(remarkExtractFrontmatter, {toml: Toml.parse, name: 'frontmatter'})
            .use(remarkPostsFrontmatter),
        }),
      ],
      // avoid clearing screen when logging, to keep warning/errors visible
      clearScreen: false,
    },
  },
};

export default config;
