import * as Path from "path";
import * as Fs from "fs";

import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import rollupGlob from "rollup-plugin-glob";
import url from "@rollup/plugin-url";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

import * as SvPre from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";
//import Toml from "toml";

import mdsvex from "./config/mdsvex";
import rollupCrawl from "./config/plugin/rollup-plugin-crawl";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const extensions = [".svelte", ".svx"];
const preprocess = [
  mdsvex,
  SvPre.default({
    postcss: true,
    defaults: { script: "typescript" },
  }),
];

const watchCss = {
  buildStart() {
    this.addWatchFile("static/global.css");
  },
};

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === "THIS_IS_UNDEFINED" ||
  onwarn(warning);

const posts = rollupCrawl({
  alias: "@@posts",
  extensions: [".svx"],
});

export default {
  client: {
    input: config.client.input().replace(/\.js$/, ".ts"),
    output: config.client.output(),
    plugins: [
      alias({
        entries: {
          "@": Path.join(__dirname, "src"),
        },
      }),
      posts,
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      watchCss,
      svelte({
        extensions,
        preprocess,
        compilerOptions: {
          dev,
          hydratable: true,
        },
      }),
      url({
        sourceDir: Path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
      //rollupGlob(),

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          babelHelpers: "runtime",
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead",
              },
            ],
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: { server: config.server.input().server.replace(/\.js$/, ".ts") },
    output: config.server.output(),
    watch: {
      chokidar: { usePolling: true },
    },
    plugins: [
      posts,
      alias({
        entries: {
          "@": Path.join(__dirname, "src"),
        },
      }),
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      watchCss,
      svelte({
        extensions,
        preprocess,
        compilerOptions: {
          dev,
          generate: "ssr",
          hydratable: true,
        },
        emitCss: false,
      }),
      url({
        sourceDir: Path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
        emitFiles: false, // already emitted by client build
      }),
      resolve({
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
      //rollupGlob(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules
    ),

    preserveEntrySignatures: "strict",
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input().replace(/\.js$/, ".ts"),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
};
