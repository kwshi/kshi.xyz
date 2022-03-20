declare module "virtual:posts" {
  import { Metadata, Timestamp } from "vite-plugin-posts";
  export * from "vite-plugin-posts";

  import { Frontmatter } from "remark-posts-frontmatter";

  const posts: Metadata<{ frontmatter: Frontmatter }>[];
  export default posts;
}
