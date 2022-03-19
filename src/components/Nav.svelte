<script lang="ts">
  import Loading from "./Loading.svelte";
  import Hills from "./Hills.svelte";

  export let segment: string | undefined;

  let scroll = 0;
</script>

<svelte:window bind:scrollY={scroll} />

<nav>
  <Loading />
  <div class="sun-wrapper">
    <div class="sun" />
  </div>
  <Hills />
  <a
    href="/"
    title="Ha, get it?  It&rsquo;s funny because my last name is &ldquo;Shi&rdquo;."
  >
    Kye's <em>Shi</em>nanigans
  </a>
  <ul>
    <li><a href="/about" class:now={segment === "about"}>about me</a></li>
    <li>
      <a href="/ramblings" class:now={segment === "ramblings"}>my ramblings</a>
    </li>
    <li><a href="/art" class:now={segment === "art"}>my art</a></li>
    <li><a href="/toys" class:now={segment === "toys"}>my projects</a></li>
    <li><a href="/contact" class:now={segment === "contact"}>contact me</a></li>
    <li><a href="/resume" class:now={segment === "resume"}>my resume</a></li>
  </ul>
</nav>

<style lang="postcss">
  nav {
    @apply sticky -top-64 pt-64
    text-warmgray-100
    transition-colors
    overflow-x-hidden
    items-end
    bg-fixed z-10;

    background-image: linear-gradient(
      to bottom,
      #378 0,
      #59a 6rem,
      #9a8 12rem,
      #b97 16rem,
      #d77 20rem
    );

    display: grid;
    grid-template-areas: "title small" "menu menu";
    grid-template-rows: 1fr max-content;
    grid-template-columns: max-content 1fr;

    & > .sun-wrapper {
      @apply absolute w-full h-full overflow-hidden;
      z-index: -10;
      mix-blend-mode: overlay;
      clip-path: margin-box;
      clip: rect(auto, auto, auto, auto);
      & > .sun {
        @apply w-24 h-24 absolute
          rounded-full right-1/3 top-40;
        background-color: #f34;
        position: fixed;
        z-index: -10;
      }
    }

    a {
      @apply font-bold;
      color: inherit;
      text-shadow: 0 0 2px theme(colors.warmgray.900);
      &:hover {
        @apply text-white;
      }
    }

    & > a[href="/"] {
      @apply font-light text-4xl ml-16 pt-2;
      grid-area: title;
      text-shadow: 0 0 0.25rem theme(colors.warmgray.900);
    }

    & > ul {
      @apply flex flex-row list-none m-0 pl-12 relative;
      grid-area: menu;

      a {
        @apply px-4 py-2 block transition-all relative;

        &::before {
          @apply absolute inset-0 transition-opacity opacity-0 duration-300;
          background-image: linear-gradient(to top, #f75, #0000);
          content: "";
          z-index: -1;
        }

        &:hover::before {
          @apply opacity-100;
        }
      }
    }
  }
</style>
