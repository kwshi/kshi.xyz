<script>
  import { stores } from "@sapper/app";

  export let segment: string | undefined;

  const LOADING_ACCEL = 8e-6;
  const LOADING_TAU = 0.2e3;
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

      if (pos >= 1) {
        setTimeout(() => {
          showLoad = false;
          setTimeout(() => (pos = 0), 300);
        }, 75);
        return;
      }

      pos = init + speed * t + (LOADING_ACCEL / 2) * t * t;
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  $: if ($preloading) loadingStart();
</script>

<nav>
  <div class="loading" style="width: {pos * 100}%;" class:shown={showLoad} />
  <a
    href="/"
    title="Ha, get it?  It&rsquo;s funny because my last name is &ldquo;Shi&rdquo;."
    >Kye's <em>Shi</em>nanigans</a
  >
  <a href="/about" class:now={segment === "about"}>about me</a>
  <a href="/ramblings" class:now={segment === "ramblings"}>my ramblings</a>
  <a href="/art" class:now={segment === "art"}>my art</a>
  <a href="/toys" class:now={segment === "toys"}>my projects</a>
  <a href="/contact" class:now={segment === "contact"}>contact me</a>
  <a href="/resume" class:now={segment === "resume"}>my resume</a>
</nav>

<style>
  nav {
    @apply flex flex-row 
    shadow-lg
    bg-lime-900
    transition-colors;
    overflow: hidden;

    & > .loading {
      @apply absolute left-0 top-0 bottom-0
        bg-gradient-to-r from-lime-800 to-lime-700
        opacity-0
        transition-opacity
        duration-300 
        ease-linear;

      &.shown {
        @apply transition-none opacity-100;
      }
    }

    & > a {
      @apply px-4 py-2 text-cyan-50 z-10;
      color: inherit;
      &[href="/"] {
        @apply font-bold;
      }
      &:hover {
        @apply bg-opacity-50 bg-lime-500 text-white;
      }
    }
  }
</style>
