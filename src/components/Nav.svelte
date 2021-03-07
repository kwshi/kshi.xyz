<script>
  import Loading from "./Loading.svelte";
  import Hills from "./Hills.svelte";

  export let segment: string | undefined;

  let scroll = 0;
</script>

<svelte:window bind:scrollY={scroll} />

<nav>
  <Loading />
  <Hills />
  <a
    href="/"
    title="Ha, get it?  It&rsquo;s funny because my last name is &ldquo;Shi&rdquo;."
    style="transform: scale({Math.max(1, 2 - Math.max(0, scroll - 160) / 32)})"
    >Kye's <em>Shi</em>nanigans</a
  >
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

<style>
  nav {
    @apply sticky -top-64 pt-64 z-20
    text-white
    transition-colors overflow-hidden;
    box-shadow: 0 1.25rem 1rem theme(colors.warmgray.900);

    background-image: linear-gradient(
      to bottom,
      #478 0%,
      #6ab 33%,
      #ab8 75%,
      #e9a 100%
    );

    a {
      color: inherit;
      font-weight: 500;
      text-shadow: 0 0 2px #221, 0 0 2px #221;
    }

    & > a[href="/"] {
      @apply text-xl ml-4 block pt-2 relative origin-bottom-left;
    }

    & > ul {
      @apply flex flex-row list-none m-0 p-0 relative;
      box-shadow: inset 0 -1rem 0.5rem -0.5rem theme(colors.warmgray.900);

      a {
        @apply px-4 py-2 block transition-all relative z-10;

        &::before {
          @apply absolute inset-0 transition-opacity opacity-0 duration-300;
          content: "";
          z-index: -1;
          background-image: linear-gradient(
            to bottom,
            transparent,
            #ea9 75%,
            transparent
          );
        }

        &:hover::before {
          @apply opacity-100;
        }
      }
    }
  }
</style>
