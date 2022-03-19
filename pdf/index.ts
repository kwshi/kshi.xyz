/// <reference types='./remark-smartypants'/>
import type * as Unist from "unist";

import Pptr from "puppeteer";
import * as Fs from "fs/promises";
import * as Toml from "@iarna/toml";
import * as Winston from "winston";
import postcss from "postcss";
import unified from "unified";
import yargs from "yargs";
import watch from "node-watch";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkMath from "remark-math";
import remarkSmartypants from "@silvenon/remark-smartypants";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import rehypeStringify from "rehype-stringify";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeInjectHeading from "./rehype-inject-heading";

import unistVisit from "unist-util-visit";
import unistIs from "unist-util-is";
import type * as mdast from "mdast";

const logger = Winston.createLogger({
  format: Winston.format.combine(Winston.format.simple()),
  transports: [new Winston.transports.Console()],
});

import postcssLoadConfig from "postcss-load-config";

const cssPath = "pdf/resume.pcss";
const mdPath = "src/routes/resume/index.svx";
const outPath = "static/cv.pdf";

const opts: {
  browser: boolean;
  watch: boolean;
} = yargs(process.argv.slice(2))
  .parserConfiguration({
    "parse-numbers": false,
    "greedy-arrays": false,
  })
  .options({
    watch: {
      type: "boolean",
      default: false,
      desc: "Watch & rebuild on change.",
    },
    browser: {
      type: "boolean",
      default: false,
      desc: "Open browser instead of rendering PDF.",
    },
  })
  .help()
  .strict().argv;

const unistIsMdastList = (node: Unist.Node): node is mdast.List =>
  node.type === "list";

const remarkCompactList = () => (tree: Unist.Node) =>
  unistVisit(tree, (node) => {
    if (
      unistIsMdastList(node) &&
      !node.spread &&
      Array.isArray(node.children) &&
      node.children.length > 1
    )
      node.data = { ...node.data, hProperties: { className: "compact" } };
  });

const initMd = () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["toml"])
    .use(remarkExtractFrontmatter, { toml: Toml.parse })
    .use(remarkMath)
    .use(remarkSmartypants, { dashes: "oldschool", backticks: true })
    .use(remarkCompactList)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeInjectHeading)
    .use(rehypeStringify);

  return async () =>
    (await processor.process(await Fs.readFile(mdPath))).contents.toString();
};

const initPptr = async () => {
  const browser = await Pptr.launch({ headless: !opts.browser });
  return { browser, page: await browser.newPage() };
};

const initPcss = async () => {
  const { plugins, options } = await postcssLoadConfig();
  const pcss = postcss(plugins);
  return async () => {
    return (
      await pcss.process(await Fs.readFile(cssPath), {
        ...options,
        from: cssPath,
      })
    ).css;
  };
};

const main = async () => {
  logger.info("starting up...");

  const buildMd = initMd();
  const [pptr, buildPcss] = await Promise.all([initPptr(), initPcss()]);
  const render = async () => {
    if (opts.browser) return;
    await pptr.page.screenshot();
    await pptr.page.waitForTimeout(500);
    await pptr.page.pdf({ path: outPath });
  };
  const loadMd = async () => {
    const md = await buildMd();
    await pptr.page.setContent(md);
    return md;
  };

  logger.info("puppeteer ready");

  logger.info("initial build...");
  const [css] = await Promise.all([buildPcss(), loadMd()]);
  const cssEl = await pptr.page.addStyleTag({ content: css });
  const cache = { css, cssEl };
  const loadPcss = async () =>
    (cache.cssEl = await pptr.page.addStyleTag({
      content: (cache.css = await buildPcss()),
    }));
  await render();
  logger.info("ready");

  if (opts.watch) {
    watch(cssPath, async () => {
      logger.info("css changed, rebuilding...");
      await Promise.all([
        cache.cssEl.evaluateHandle((e: Element) =>
          e.parentNode?.removeChild(e)
        ),
        loadPcss(),
      ]);
      await render();
      logger.info("done");
    });
    watch(mdPath, async () => {
      logger.info("md changed, rebuilding...");
      await loadMd();
      await loadPcss();
      await render();
      logger.info("done");
    });
  } else await pptr.browser.close();
};

main();
