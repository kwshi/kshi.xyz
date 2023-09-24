<script lang="ts">
  import * as Motion from "svelte/motion";
  import * as Random from "$lib/random";

  type Hill = { position: number; size: number; depth: number };

  const generateHills = (count: number): readonly Readonly<Hill>[] => {
    const hills: Readonly<Hill>[] = [];
    const order = Random.permutation(count);
    for (let i = 0; i < count; ++i)
      hills.push({
        position: i - (count - 1) / 2 + Random.normal() / 2,
        size: Math.random(),
        depth: order[i]! / (count - 1),
      });
    hills.sort((a, b) => b.depth - a.depth);
    return hills;
  };

  const hills = generateHills(6);

  const hillAspect = 2;
  const hillSpacing = 16 * 12; // ~12rem
  const parallaxSize = 16 * 8; // ~8rem
  const sunOffsetScale = 16 * 32;

  let viewportWidth = 1;
  let viewportHeight = 1;
  let orientationEnabled = false;

  const parallax = Motion.spring(0, { stiffness: 0.1, damping: 0.75 });
</script>

<svelte:window
  on:mousemove={(event) => {
    if (!orientationEnabled)
      $parallax = (event.clientX / event.currentTarget.innerWidth) * 2 - 1;
  }}
  on:deviceorientation={(event) => {
    orientationEnabled = true;
    $parallax = (event.gamma ?? 0) / 90;
  }}
/>

<div
  class="scene"
  bind:clientWidth={viewportWidth}
  bind:clientHeight={viewportHeight}
  data-parallax={$parallax}
>
  <svg>
    <defs>
      <radialGradient id="sun">
        <stop offset="0" stop-color="var(--color-sun-inner)" />
        <stop offset="100%" stop-color="var(--color-sun-outer)" />
      </radialGradient>
    </defs>
    <circle class="sun" />
    {#each hills as hill}
      {@const positionScaled =
        viewportWidth / 2 +
        hill.position * hillSpacing +
        $parallax * (2 - hill.depth) * parallaxSize}
      {@const sunOffset =
        (positionScaled - (2 / 3) * viewportWidth) / sunOffsetScale}
      {@const sunProportion =
        1 / Math.sqrt(1 + Math.pow((4 * sunOffset) / (2 - hill.depth), 2))}
      {@const baseWidth = viewportHeight * hillAspect}
      {@const rayWidth = baseWidth * sunProportion}
      {@const sunSign = Math.sign(sunOffset)}
      {@const points = [
        positionScaled,
        0,
        positionScaled + baseWidth - 1,
        viewportHeight,
        positionScaled - baseWidth + 1,
        viewportHeight,
      ]}
      {@const sunPoints = [
        positionScaled,
        0,
        positionScaled - sunSign * baseWidth,
        viewportHeight,
        positionScaled - sunSign * rayWidth,
        viewportHeight,
      ]}
      <g
        class="hill"
        style="--hill-position: {hill.position}; --hill-depth:{hill.depth}; --hill-size:{hill.size}"
      >
        <polygon
          class="base"
          points={points.join(" ")}
          data-sun={sunProportion}
        />
        <polygon class="light" points={sunPoints.join(" ")} />
      </g>
    {/each}
  </svg>
</div>

<style lang="postcss">
  .scene {
    --color-sky-top: #84cad5;
    --color-sky-bottom: #a4ead5;

    --color-sun-inner: #ffd982;
    --color-sun-outer: #ffce7f;

    --color-hill-light: #fff0de;
    --color-hill-front: #eee8db;
    --color-hill-back: #97c0c9;

    position: fixed;
    inset: 0;
    overflow: hidden;

    background-image: linear-gradient(
      to bottom left,
      var(--color-sky-top),
      var(--color-sky-bottom) 100%
    );
  }

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
  }

  .sun {
    r: 3rem;
    cx: calc(200% / 3);
    cy: 8rem;
    fill: url(#sun);
  }

  .hill {
    transform: translateY(calc(8rem - var(--hill-size) * 6rem));

    --color-hill: color-mix(
      in hsl,
      var(--color-hill-back) calc(var(--hill-depth) * 100%),
      var(--color-hill-front)
    );
  }

  .base {
    fill: var(--color-hill);
  }

  .light {
    fill: color-mix(in srgb, var(--color-hill-light), var(--color-hill));
  }
</style>
