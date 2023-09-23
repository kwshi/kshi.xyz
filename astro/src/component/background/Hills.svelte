<script lang="ts">
  import { spring } from "svelte/motion";

  type Hill = { position: number; size: number; depth: number; aspect: number };

  // https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
  const randomNormal = () => {
    // Math.random() ∈ [0,1)
    const r = Math.sqrt(-2 * Math.log(1 - Math.random()));
    const θ = 2 * Math.PI * Math.random();
    return r * Math.cos(θ);
  };

  const generateHills = (count: number): readonly Readonly<Hill>[] => {
    const hills: Readonly<Hill>[] = [];
    for (let i = 0; i < count; ++i)
      hills.push({
        position: i - (count - 1) / 2 + randomNormal() / 2,
        size: Math.random(),
        depth: Math.random(),
        aspect: Math.random() + 2,
      });
    hills.sort((a, b) => b.depth - a.depth);
    return hills;
  };

  const hills = generateHills(6);

  const hillSpacing = 16 * 12; // ~12rem
  const parallaxSize = 16 * 8; // ~8rem

  let viewportWidth = 1;
  let viewportHeight = 1;
  let orientationEnabled = false;

  const parallax = spring(0, { stiffness: 0.1, damping: 0.75 });
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
      {@const sunOffset = positionScaled / viewportWidth - 2 / 3}
      {@const sunProportion =
        1 / Math.sqrt(1 + Math.pow((4 * sunOffset) / (2 - hill.depth), 2))}
      {@const points = [
        positionScaled,
        0,
        viewportWidth,
        (viewportWidth - positionScaled) / hill.aspect,
        viewportWidth,
        viewportHeight,
        0,
        viewportHeight,
        0,
        positionScaled / hill.aspect,
      ]}
      {@const sunPoints =
        sunOffset < 0
          ? [
              positionScaled,
              0,
              viewportWidth,
              // todo sign
              (viewportWidth - positionScaled) / hill.aspect,
              viewportWidth,
              (viewportWidth - positionScaled) / hill.aspect / sunProportion,
            ]
          : [
              positionScaled,
              0,
              0,
              // todo sign
              positionScaled / hill.aspect,
              0,
              positionScaled / hill.aspect / sunProportion,
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
    --color-hill-back: #84c0c7;

    position: absolute;
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
