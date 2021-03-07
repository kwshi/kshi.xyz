<script>
  import { stores } from "@sapper/app";

  const LOADING_ACCEL = 8e-6;
  const LOADING_TAU = 0.3e3;
  const LOADING_MAX = 2 / 3;

  let pos = 0;
  let showLoad = false;

  const { preloading } = stores();

  const loadingStart = () => {
    const start = Date.now();
    showLoad = true;

    const frame = () => {
      const t = Date.now() - start;

      if (!$preloading) {
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

  $: if ($preloading) loadingStart();
</script>

<div
  class="loading"
  style="transform: translate({(pos - 1) * 100}%)"
  class:shown={showLoad}
/>

<style>
  .loading {
    @apply absolute left-0 top-0 bottom-0
        opacity-0
        transition-opacity
        duration-300 
    w-full
        ease-linear;

    z-index: -20;

    background-image: linear-gradient(to right, #111, #333);
    box-shadow: 1rem 0 1rem #333;
    mix-blend-mode: color-dodge;
    will-change: opacity;

    &.shown {
      @apply transition-none opacity-100;
    }
  }
</style>
