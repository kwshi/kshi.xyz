const svPreprocess = require("svelte-preprocess");
const mdsvex = require("./config/mdsvex");

module.exports = {
  preprocess: [
    mdsvex,
    svPreprocess({
      postcss: true,
      defaults: { script: "typescript", style: "postcss" },
    }),
  ],
};
