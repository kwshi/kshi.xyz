import * as HastSelect from "hast-util-select";
import hastToString from "hast-util-to-string";
import hastFromString from "hast-util-from-string";

import Katex from "katex";

export default () => (tree) => {
  HastSelect.selectAll(".math", tree).forEach((node) => {
    const displayMode = node.properties.className.includes("math-display");
    const rendered = Katex.renderToString(hastToString(node), {
      displayMode,
      macros,
    });
    hastFromString(node, `{@html ${JSON.stringify(rendered)}}`);
  });
};
