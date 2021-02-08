export default () => (tree) => {
  const i = tree.children.findIndex((node) => node.type === "heading");
  if (i === -1) return;
  tree.children.splice(i, 0, {
    type: "heading",
    depth: tree.children[i].depth,
    children: [{ type: "text", value: "toc" }],
  });
};
