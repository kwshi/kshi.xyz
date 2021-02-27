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


</style>
