import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import svelte from "@astrojs/svelte";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), svelte()],
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] },
  server: {
    host: true,
  },
});
