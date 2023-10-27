<script lang="ts">
  import Loading from "./Loading.svelte";
  import Hills from "./Hills.svelte";
  import Background from "./Background.svelte";

  import { onMount } from "svelte";

  export let segment: string | null;

  let scroll = 0;
  let nav: HTMLElement | undefined;
  let pos = 0;

  const onScroll = () => {
    pos = nav!.getBoundingClientRect().top;
  };
</script>

<svelte:window bind:scrollY={scroll} on:scroll={onScroll} />

<nav bind:this={nav}>
  <Background />
  <Loading />
  <Hills {pos} />
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
    @apply text-warmgray-100
    transition-colors
    items-end;
    z-index: 10;

    position: sticky;
    top: -16rem;
    padding-top: 16rem;
    //overflow: hidden;

    display: grid;
    grid-template-areas: "title small" "menu menu";
    grid-template-rows: 1fr max-content;
    grid-template-columns: max-content 1fr;

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

        &.now::before {
          @apply opacity-50;
        }

        &:hover::before {
          @apply opacity-100;
        }
      }
    }
  }
</style>
