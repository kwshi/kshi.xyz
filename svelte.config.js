const mdsvex = require("./config/mdsvex");

module.exports = {
  preprocess: [
    mdsvex,
    SvPre.default({
      postcss: true,
      defaults: { script: "typescript" },
    }),
  ],
};
