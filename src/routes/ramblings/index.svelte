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
    (fm.updated ? `, updated ${showDate(frontmatter.updated)}` : "");

  //{JSON.stringify(posts)}
</script>

<ul>
  {#each posts as post}
    <li>
      <header>
        <a href="/ramblings/{post.prefix.join('/')}">
          <strong>{post.data.frontmatter.title}</strong>
        </a>
        <em>{post.data.frontmatter.short}</em>
        [{showPostDates(post.data.frontmatter)}]
      </header>
      {@html post.data.intro}
      <a href="/ramblings/{post.prefix.join('/')}">Read more...</a>
    </li>
  {/each}
</ul>
