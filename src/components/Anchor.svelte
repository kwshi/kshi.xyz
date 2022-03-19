<script lang="ts">
  import { scrollto, setGlobalOptions } from "svelte-scrollto";

  export let rel: string | undefined = undefined;
  export let href: string;

  const hash = href.match("#[^#]+$")?.[0];

  setGlobalOptions({ duration: 300 });
</script>

{#if hash}
  <a {href} {rel} class={$$props.class} use:scrollto={hash}>
    <slot />
  </a>
{:else}
  <a {href} {rel} class={$$props.class}>
    <slot />
  </a>
{/if}
