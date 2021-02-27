import mdastToc from 'mdast-util-toc';
import mdastToHast from 'mdast-util-to-hast';
import hastToMdast from 'hast-util-to-mdast';
import * as Md from 'mdast-builder';

export default () => tree => {
  const toc = mdastToc(tree, {
    tight: true,
  });

  tree.children.unshift(Md.html('<article>'));
  tree.children.push(Md.html('</article>'));

  if (!toc.map) return;

  tree.children.splice(0, 0,
    Md.html('<nav>'),
    toc.map,
    Md.html('</nav>'),
  );
}
