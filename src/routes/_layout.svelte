<script lang="ts">
  import Nav from "@/components/Nav.svelte";
  import { stores } from "@sapper/app";

  export let segment: string | undefined;
</script>

<Nav {segment} />

<main>
  <slot />
</main>

<style global>
  // temporary trick to use remark-toc to generate toc sidebars,
  // but maybe we can write our own remark plugin to do it
  // automatically
  #toc {
    display: none;

    & + ul {
    }
  }
</style>
