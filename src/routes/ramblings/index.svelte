<script>
  //import posts from './*/**/*.svx';

  import posts from "@@posts";

  interface Post {
    data: {
      frontmatter: {
        title: string;
        tags: string[];
        short: string;
        updated: string;
      };
      headings: string[];
      intro: string;
    };
    prefix: string[];
  }

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
        <span
          >[last updated {new Date(
            post.data.frontmatter.updated
          ).toLocaleDateString()}]</span
        >
      </header>
      {@html post.data.intro}
    </li>
  {/each}
</ul>
