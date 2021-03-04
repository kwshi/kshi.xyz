<script lang="ts">
  import Nav from "@/components/Nav.svelte";

  export let segment: string | undefined;
</script>

<Nav {segment} />

<main>
  <slot />
</main>
