export default () => (_, file) => {
  const front = file.data.frontmatter;
  if (!front) {
    file.message("missing frontmatter");
    return;
  }

  for (const key of ["title", "short", "tags"])
    if (!front[key])
      file.message(`frontmatter missing ${JSON.stringify(key)}.`);

  if (front.tags && !Array.isArray(front.tags))
    file.message(
      `frontmatter "tags" value ${JSON.stringify(front.tags)} is not an array.`
    );
};
