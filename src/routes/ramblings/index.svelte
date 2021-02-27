<script>
  //import posts from './*/**/*.svx';

  import posts from "@@posts";

  interface Frontmatter {
    title: string;
    tags: string[];
    short: string;
  }

  interface Timeline {
    added: string;
    modified?: string;
  }

  interface Post {
    data: {
      frontmatter: Frontmatter;
      headings: string[];
      intro: string;
    };
    prefix: string[];
    timeline: Timeline;
  }

  const showDate = (s: string) => new Date(s).toLocaleDateString();
  const showPostDates = (t: Timeline) =>
    `posted ${showDate(t.added)}` +
    (t.modified ? `, updated ${showDate(t.modified)}` : "");

  //{JSON.stringify(posts)}
</script>

  {#each posts as post}
    <section>
      <header>
        <a href="/ramblings/{post.prefix.join('/')}">
          <h2>{post.data.frontmatter.title}</h2>
        </a>
        <em>{post.data.frontmatter.short}</em>
        <span>[{showPostDates(post.timeline)}]</span>
      </header>
      {@html post.data.intro}
      <a href="/ramblings/{post.prefix.join('/')}">Read more...</a>
    </section>
  {/each}
