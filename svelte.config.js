// @ts-check
import svPreprocess from "svelte-preprocess";
import mdsvex from "./config/mdsvex.js";
import adapter from "@sveltejs/adapter-auto";

import rollupCrawl from "./config/plugin/rollup-plugin-crawl.js";

import * as Path from "path";
import * as Url from "url";

import pcssScss from "postcss-scss";
import pcssNested from "postcss-nested";
import tailwind from "tailwindcss";

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
        rollupCrawl({
          alias: "@@posts",
          extensions: [".svx"],
        }),
      ],
    },
  },
};

export default config;
