import unistIs from "unist-util-is";
import unified from "unified";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

const types = ["paragraph", "list", "blockquote", "code"];

export default () => async (tree, file) => {
  const processor = unified()
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify);
  const root = await processor.run({
    type: "root",
    children: tree.children.filter((node) => unistIs(node, types)).slice(0, 2),
  });
  file.data.intro = processor.stringify(root);
};
