export default () => (_, file) => {
  const front = file.data.frontmatter;
  if (!front) {
    file.message("missing frontmatter");
    return;
  }

  for (const key of ["title", "short", "tags", "updated"])
    if (!front[key])
      file.message(`frontmatter missing ${JSON.stringify(key)}.`);

  if (!Array.isArray(front.tags))
    file.message(
      `frontmatter "tags" value ${JSON.stringify(front.tags)} is not an array.`
    );

  if (isNaN(new Date(front.updated)))
    file.message(
      `frontmatter "updated" value ${JSON.stringify(
        front.updated
      )} does not specify a valid date.`
    );
};
