<script lang="ts">
  import Nav from "$components/Nav.svelte";
  import { page } from "$app/stores";
</script>

<Nav segment={$page.routeId} />

<main>
  <slot />
</main>

<style lang="postcss">
  @import "../assets/global.pcss";

  main {
    @apply grid gap-x-8;
    grid-template-areas: "pad content toc" "pad footnote toc";
    grid-template-columns:
      minmax(2rem, 1fr)
      minmax(32rem, 48rem)
      minmax(16rem, 1fr);
  }
</style>
