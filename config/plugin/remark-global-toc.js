const mdastToc = require("mdast-util-toc");
const Md = require("mdast-builder");

module.exports = () => (tree) => {
  const toc = mdastToc(tree, {
    tight: true,
  });

  tree.children.unshift(Md.html("<article>"));
  tree.children.push(Md.html("</article>"));

  if (!toc.map) return;

  tree.children.splice(0, 0, Md.html("<nav>"), toc.map, Md.html("</nav>"));
};
