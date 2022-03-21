<script>
  import { navigating } from "$app/stores";
  import { onMount } from "svelte";

  const LOADING_ACCEL = 4e-6;
  const LOADING_TAU = 0.3e3;
  const LOADING_MAX = 2 / 3;

  let pos = 0;
  let showLoad = false;

  let mounted = false;
  onMount(() => {
    mounted = true;
    return () => void (mounted = false);
  });

  $: active = $navigating !== null;

  const loadingStart = () => {
    const start = Date.now();
    showLoad = true;

    const frame = () => {
      const t = Date.now() - start;

      if (!active) {
        loadingCleanup();
        return;
      }

      pos = (1 - LOADING_TAU / (t + LOADING_TAU)) * LOADING_MAX;
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const loadingCleanup = () => {
    const start = Date.now();

    const init = pos;
    const speed = Math.pow(LOADING_MAX - init, 2) / LOADING_MAX / LOADING_TAU;

    const frame = () => {
      const t = Date.now() - start;

      pos = init + speed * t + (LOADING_ACCEL / 2) * t * t;

      if (pos >= 1) {
        pos = 1;
        setTimeout(() => {
          showLoad = false;
          setTimeout(() => (pos = 0), 300);
        }, 75);
        return;
      }
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  $: if (mounted && active) loadingStart();
</script>

<div
  class="loading"
  style="transform: translate({(pos - 1) * 100}%)"
  class:shown={showLoad}
/>

<style lang="postcss">
  .loading {
    @apply absolute left-0 top-0 bottom-0
        opacity-0
        transition-opacity
        duration-300 
    w-full
        ease-linear;

    z-index: -10;

    background-image: linear-gradient(to right, #0000, #f65a);
    mix-blend-mode: overlay;
    will-change: opacity;

    &.shown {
      @apply transition-none opacity-100;
    }
  }
</style>
