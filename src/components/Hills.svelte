<script>
  const SLOPE = 3;

  const rand3 = () => (Math.random() + Math.random() + Math.random()) / 3;

  const randTicks = (count: number, spacing: number) => {
    const ts: number[] = [];
    for (let i = 0, prev = -spacing; i < count; ++i)
      ts.push((prev += spacing * 2 * rand3()));
    return ts;
  };

  const peaks = (count: number, spacing: number, height: number) =>
    randTicks(count, spacing).map((x) => [x, rand3() * height, Math.random()]);

  const path = (x: number, h: number) => {
    const w = h * SLOPE;
    return `M ${x - w} -1 l ${w} ${h} l ${w} ${-h} Z`;
  };

  const front = peaks(32, 256, 96);
  const back = peaks(32, 128, 64);

  const pks = peaks(64, 1, 1).sort(([, , z1], [, , z2]) => z1 - z2);

  const color = (t: number) =>
    `rgb(${224 - 192 * t}, ${128 - 108 * t}, ${96 - 50 * t})`;

  let scroll = 0;
  let mouseX = 0;
  let screenWidth = 1;

  const mouseMove = (e: MouseEvent) => (mouseX = e.clientX);
</script>

<svelte:window
  bind:scrollY={scroll}
  bind:innerWidth={screenWidth}
  on:mousemove={mouseMove}
/>

<svg width="100%" height="192" xmlns="http://www.w3.org/2000/svg">
  <g transform="matrix(1, 0, 0, -1, 0, 192)">
    {#each pks as [x, y, z]}
      <path
        d={path(
          x * 128 + z * 64 + (mouseX / screenWidth) * 64 * z,
          y * 64 + z * 64 - scroll * (z / 2 + 1 / 4) + 32
        )}
        fill={color(z)}
      />
    {/each}

    <!--
    {#each back as [x, y]}
      <path fill="#875" d={path(x, Math.max(y + 16 - scroll / 2, 0))} />
    {/each}
    {#each front as [x, y]}
      <path fill="#504832" d={path(x, Math.max(0, y + 8 - scroll / 4))} />
    {/each}
   -->
  </g>
</svg>

<style>
  svg {
    @apply absolute -bottom-0;
    z-index: -10;
  }
</style>
