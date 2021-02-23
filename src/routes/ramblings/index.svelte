<script>
  //import posts from './*/**/*.svx';

  import posts from "@@posts";

  interface Frontmatter {
    title: string;
    tags: string[];
    short: string;
    updated?: string;
    created: string;
  }

  interface Post {
    data: {
      frontmatter: Frontmatter;
      headings: string[];
      intro: string;
    };
    prefix: string[];
  }

  const showDate = (s: string) => new Date(s).toLocaleDateString();
  const showPostDates = (fm: Frontmatter) =>
    `posted ${showDate(fm.created)}` +
    (fm.updated ? `, updated ${showDate(fm.updated)}` : "");

  //{JSON.stringify(posts)}
</script>

  {#each posts as post}
    <section>
      <header>
        <a href="/ramblings/{post.prefix.join('/')}">
          <h2>{post.data.frontmatter.title}</h2>
        </a>
        <em>{post.data.frontmatter.short}</em>
        <span>[{showPostDates(post.data.frontmatter)}]</span>
      </header>
      {@html post.data.intro}
      <a href="/ramblings/{post.prefix.join('/')}">Read more...</a>
    </section>
  {/each}
