<script lang="ts">
  import { default as posts, type Timestamp } from "virtual:posts";

  const showDate = (t: number) => new Date(t).toLocaleDateString();
  const showPostDates = (t: Timestamp | undefined) =>
    typeof t === "undefined"
      ? "not yet posted"
      : `posted ${showDate(t.added)}` +
        (t.modified ? `, updated ${showDate(t.modified)}` : "");
</script>

<article>
  {#each posts as post}
    <section>
      <header>
        <a href="/ramblings/{post.segments.join('/')}">
          <h2>{post.data.frontmatter.title}</h2>
        </a>
        <em class="short">{post.data.frontmatter.short}</em>
        <span class="date">[{showPostDates(post.timestamp)}]</span>
      </header>
      <div class="preview">
        {@html post.data.intro}
      </div>
      <div class="overlay">
        <a href="/ramblings/{post.segments.join('/')}">Read more...</a>
      </div>
    </section>
  {/each}
</article>

<style lang="postcss">
  article {
    // weird

    display: grid;
    @apply gap-y-8 mt-8;

    & > section {
      display: grid;
      grid-template-areas: "header" "content";

      & > header {
        @apply items-baseline gap-x-2 grid;
        grid-template-areas: "title date" "short short";
        grid-template-columns: 1fr max-content;
        grid-area: header;

        & > a {
          grid-area: title;
          & > h2 {
            @apply m-0;
          }
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
        @apply bg-gradient-to-b from-transparent to-warmgray-900
    z-10
    flex flex-col items-center justify-end;
        grid-area: content;

        & > a {
          @apply bg-emerald-600 text-white px-2 py-1 text-sm rounded
      shadow font-bold bg-opacity-50 transition;

          &:hover {
            @apply bg-opacity-100 transform -translate-y-0.5;
          }
        }
      }
    }
  }
</style>
