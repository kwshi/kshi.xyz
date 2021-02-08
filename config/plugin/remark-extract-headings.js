import unistVisit from "unist-util-visit";
import mdastToString from "mdast-util-to-string";

export default () => (tree, file) => {
  const heads = (file.data.headings = []);
  unistVisit(tree, "heading", (node) => {
    heads.push(mdastToString(node));
  });
};
