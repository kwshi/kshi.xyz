import * as Path from "path";
import * as Fs from "fs";

import rollupAlias from "@rollup/plugin-alias";
import rollupResolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import rollupCjs from "@rollup/plugin-commonjs";
import rollupGlob from "rollup-plugin-glob";
import rollupUrl from "@rollup/plugin-url";
import rollupSv from "rollup-plugin-svelte";
import rollupBabel from "@rollup/plugin-babel";
import { terser as rollupTerser } from "rollup-plugin-terser";
import rollupTs from "@rollup/plugin-typescript";

import * as SvPre from "svelte-preprocess";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";
//import Toml from "toml";

const mdsvex = require("./config/mdsvex");
import rollupCrawl from "./config/plugin/rollup-plugin-crawl";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const extensions = [".svelte", ".svx", ".md"];
const preprocess = [
  mdsvex,
  SvPre.default({
    postcss: true,
    defaults: { script: "typescript" },
  }),
];

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === "THIS_IS_UNDEFINED" ||
  onwarn(warning);

const sapperPlugins = ({ server }) => [
  rollupAlias({
    entries: {
      "@": Path.join(__dirname, "src"),
    },
  }),
  rollupCrawl({
    alias: "@@posts",
    extensions: [".svx"],
  }),
  {
    buildStart() {
      this.addWatchFile("static/global.css");
    },
  },
  rollupSv({
    extensions,
    preprocess,
    compilerOptions: {
      dev,
      hydratable: true,
      generate: server ? "ssr" : undefined,
    },
    emitCss: !server,
  }),
  rollupUrl({
    sourceDir: Path.resolve(__dirname, "src/node_modules/images"),
    publicPath: "/client/",
  }),
  rollupResolve({
    browser: true,
    dedupe: ["svelte"],
  }),
  rollupCjs(),

  rollupTs({ sourceMap: dev }),
];

const watch = {
  // https://github.com/rollup/rollup/issues/1666
  chokidar: { usePolling: true },
};

export default {
  client: {
    input: config.client.input().replace(/\.js$/, ".ts"),
    output: config.client.output(),
    watch,
    plugins: [
      ...sapperPlugins({ server: false }),
      legacy &&
        rollupBabel({
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
      !dev && rollupTerser({ module: true }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: { server: config.server.input().server.replace(/\.js$/, ".ts") },
    output: config.server.output(),
    watch,
    plugins: [...sapperPlugins({ server: true })],
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
      rollupResolve(),
      rollupCjs(),
      rollupTs({ sourceMap: dev }),
      !dev && rollupTerser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
};
