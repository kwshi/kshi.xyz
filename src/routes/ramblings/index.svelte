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

<article>
  {#each posts as post}
    <section>
      <header>
        <a href="/ramblings/{post.prefix.join('/')}">
          <h2>{post.data.frontmatter.title}</h2>
        </a>
        <em class='short'>{post.data.frontmatter.short}</em>
        <span class='date'>[{showPostDates(post.timeline)}]</span>
      </header>
      <div class='preview'>
      {@html post.data.intro}
      </div>
      <div class='overlay'/>
      <a href="/ramblings/{post.prefix.join('/')}">Read more...</a>
    </section>
  {/each}
</article>

<style>
article {
display: grid;
@apply gap-y-8;

& > section {
display: grid;
grid-template-areas: 'header' 'content';

& > header {
  @apply items-baseline gap-x-2 grid;
  grid-template-areas: 'title date' 'short short';
  grid-template-columns: 1fr max-content;
  grid-area: header;
  
  & > a {
    grid-area: title;
    & > h2 { @apply m-0; }
  }
  & > .short { 
    @apply text-lg;
    grid-area: short; 
  }
  & > .date { 
    @apply text-sm opacity-80;
    grid-area: date; 
  }
}

& > .preview {
  grid-area: content;
}

& > .overlay {
  @apply bg-gradient-to-b from-transparent to-warmgray-800 z-10;
  grid-area: content;
}
}
}
</style>
