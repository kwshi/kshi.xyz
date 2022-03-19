declare module "virtual:posts" {
  export interface Frontmatter {
    title: string;
    tags: string[];
    short: string;
  }

  export interface Timeline {
    added: string;
    modified?: string;
  }

  export interface Post {
    data: {
      frontmatter: Frontmatter;
      headings: string[];
      intro: string;
    };
    prefix: string[];
    timeline?: Timeline;
  }

  const posts: Post[];
  export default posts;
}
