// This is a workaround to the fact that requiring `sapper.base` causes
// relative links, specifically same-page `#id` anchors, to incorrectly point
// to the root path.

// We rewrite all same-page relative links in terms of their absolute routing
// paths, as determined from filename.  As such, dynamic routes are not
// supported.  For now, I'm not too bothered by that, since most of my content
// is static anyway, but a more general solution would be to prepend
// `{$page.path}` instead of filename-path.  The caveat there is that we would
// also have to prepend

// ```
// <script>
//   import {stores} from '@sapper/app'
//   const {page} = stores();
// </script>
// ```

// to each Svelte component as well.

// (For more discussion on this issue and other workarounds, see
// https://github.com/sveltejs/sapper/issues/904.)

const Path = require("path");
const unistVisit = require("unist-util-visit");

const getRoute = (filename) => {
  const parent = Path.relative("src/routes", Path.dirname(filename));
  const base = Path.basename(filename, Path.extname(filename));
  return (base === "index" ? parent : `${parent}/${base}`)
    .split(Path.sep)
    .join("/");
};

module.exports = () => (tree, file) => {
  const route = getRoute(file.filename);
  if (route.split(Path.sep)[0] === "..") return;

  unistVisit(tree, "element", (node) => {
    if (
      node.tagName !== "Components.a" ||
      !node.properties.href?.startsWith("#")
    )
      return;
    node.properties.href = `/${route}/${node.properties.href}`;
  });
};
