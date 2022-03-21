<script lang="ts">
  import { onMount } from "svelte";

  type Peak = [number, number, number];

  const SLOPE = 3;

  // sum of three uniform random distributions; approximation to a normal
  const rand3 = () => (Math.random() + Math.random() + Math.random()) / 3;

  const randTicks = (count: number, spacing: number) => {
    const ts: number[] = [];
    for (let i = 0, prev = -spacing; i < count; ++i)
      ts.push((prev += spacing * 2 * rand3()));
    return ts;
  };

  const randPeaks = (count: number, spacing: number, height: number): Peak[] =>
    randTicks(count, spacing).map((x) => [x, rand3() * height, Math.random()]);

  const path = (x: number, h: number) => {
    const w = h * SLOPE;
    return `M ${x - w} -1 l ${w} ${h} l ${w} ${-h} Z`;
  };
  const glowPath = (x: number, h: number, z: number) => {
    const w = h * SLOPE;
    const dx = x - (2 / 3) * screenWidth;
    const fr = 1 - 1 / Math.sqrt(1 + Math.pow(dx / z, 2));
    const sgn = Math.sign(dx);
    return x > (2 / 3) * screenWidth
      ? `M ${x - w} -1 l ${w} ${h} l ${-w + fr * w} ${-h} Z`
      : `M ${x - sgn * w} -1 l ${sgn * w} ${h} l ${sgn * w * (fr - 1)} ${-h} Z`;
  };

  let peaks: Peak[] = [];
  let mounted = false;

  onMount(() => {
    peaks = randPeaks(64, 1, 1).sort(([, , z1], [, , z2]) => z1 - z2);
    console.log("mount");
    setTimeout(() => void (mounted = true), 0);
  });

  // rgb(32,20,46)
  // rgb(192,108,50)

  const color = (t: number) =>
    `rgb(${228 - 180 * t}, ${123 - 108 * t}, ${86 - 40 * t})`;

  let scroll = 0;
  let screenWidth = 1;
  let position: number = 1 / 2;

  const mouseMove = (e: MouseEvent) => (position = e.clientX / screenWidth);
</script>

<svelte:window
  bind:scrollY={scroll}
  bind:innerWidth={screenWidth}
  on:mousemove={mouseMove}
/>

<svg width="100%" height="192" xmlns="http://www.w3.org/2000/svg">
  <g transform="matrix(1, 0, 0, -1, 0, 192)">
    {#each peaks as [x, y, z]}
      <g style={`transform: translate(0, ${-scroll * (z / 2 + 1 / 4)}px)`}>
        <g
          class="cool"
          style={`transform: translate(${(position - 1 / 2) * z * (100 / 4)}%`}
        >
          <g
            class="start"
            style={`transform: translate(0, -${
              +!mounted * (1 / 2 + z) * 100
            }%)`}
          >
            <path
              class="hill"
              d={path(x * 128, y * 64 + z * 64 + 32)}
              fill={color(z)}
            />
            <path
              d={glowPath(x * 128, y * 64 + z * 64 + 32, (z + 2) * 128)}
              fill={color((3 / 4) * z)}
            />
          </g>
        </g>
      </g>
    {/each}
  </g>
</svg>

<style lang="postcss">
  svg {
    position: absolute;
    bottom: 0;
    z-index: -10;

    .cool {
      transition: linear transform 50ms;
    }

    .start {
      transition: transform 0.5s;
      transform: translate(0, 0);
    }
  }
</style>
