import path from "path";
import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import * as SvPre from "svelte-preprocess";
import * as Svx from "mdsvex";
import typescript from "@rollup/plugin-typescript";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";
import Toml from "toml";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGithub from "remark-github";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const extensions = [".svelte", ".svx"];
const preprocess = [
  Svx.mdsvex({
    remarkPlugins: [remarkGithub, remarkMath],
    rehypePlugins: [rehypeKatex],
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
  }),
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

export default {
  client: {
    input: config.client.input().replace(/\.js$/, ".ts"),
    output: config.client.output(),
    plugins: [
      alias({
        entries: {
          "@": path.join(__dirname, "src"),
        },
      }),
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
        sourceDir: path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({ sourceMap: dev }),

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
      alias({
        entries: {
          "@": path.join(__dirname, "src"),
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
        sourceDir: path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
        emitFiles: false, // already emitted by client build
      }),
      resolve({
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
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
