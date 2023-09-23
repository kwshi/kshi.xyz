<script lang="ts">
  import { spring } from "svelte/motion";

  type Hill = { position: number; size: number; depth: number };

  const generateHills = (): readonly Readonly<Hill>[] => {
    const hills: Readonly<Hill>[] = [];
    for (let i = 0; i < 12; ++i)
      hills.push({
        position: 3 * Math.random() - 1,
        size: Math.random(),
        depth: Math.random(),
      });
    hills.sort((a, b) => b.depth - a.depth);
    return hills;
  };

  const hills = generateHills();

  const hillAspect = 2;

  let viewportWidth = 1;
  let viewportHeight = 1;

  const parallax = spring(0, { stiffness: 0.1, damping: 0.75 });

  let orientationEnabled = false;

  let gamma = 0;
</script>

<svelte:window
  on:mousemove={(event) => {
    if (!orientationEnabled)
      $parallax = (event.clientX / event.currentTarget.innerWidth) * 2 - 1;
  }}
  on:deviceorientation={(event) => {
    orientationEnabled = true;
    $parallax = (event.gamma ?? 0) / 90;
    gamma = event.gamma ?? 0;
  }}
/>

<div
  class="scene"
  bind:clientWidth={viewportWidth}
  bind:clientHeight={viewportHeight}
  data-parallax={$parallax}
>
  <!--div style="position:absolute">{gamma}</div-->
  <svg>
    <defs>
      <radialGradient id="sun">
        <stop offset="0" stop-color="#fff9d2" />
        <stop offset="100%" stop-color="#fff4bc" />
      </radialGradient>
    </defs>
    <circle class="sun" />
    {#each hills as hill}
      {@const positionScaled =
        (3 * hill.position - 1 + ($parallax * (1 - hill.depth)) / 4) *
        viewportWidth}
      {@const points = [
        positionScaled,
        0,
        viewportWidth,
        (viewportWidth - positionScaled) / hillAspect,
        viewportWidth,
        viewportHeight,
        0,
        viewportHeight,
        0,
        positionScaled / hillAspect,
      ]}
      <polygon
        class="hill"
        points={points.join(" ")}
        style="--hill-depth:{hill.depth}; --hill-size:{hill.size}"
      />
    {/each}
  </svg>
</div>

<style lang="postcss">
  .scene {
    position: absolute;
    inset: 0;
    overflow: hidden;

    background-image: linear-gradient(to bottom, #a4eae5, #c4fae5 8rem);
  }

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
  }

  .sun {
    r: 2rem;
    cx: calc(200% / 3);
    cy: 5rem;
    fill: url(#sun);
  }

  .hill {
    fill: color-mix(in hsl, #c4eadf calc(var(--hill-depth) * 100%), #f8f4f2);
    transform: translateY(calc(4rem - var(--hill-size) * 2rem));
  }
</style>
