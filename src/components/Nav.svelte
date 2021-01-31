<script>
  export let segment: string | undefined;
</script>

<nav>
  <a href="/about" class:now={segment === "about"}>about me</a>
  <a href="/ramblings" class:now={segment === "ramblings"}>my ramblings</a>
  <a href="/art" class:now={segment === "art"}>my art</a>
  <a href="/toys" class:now={segment === "toys"}>my projects</a>
  <a href="/contact" class:now={segment === "contact"}>contact me</a>
</nav>
