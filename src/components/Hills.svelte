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
    randTicks(count, spacing).map((x) => [x, rand3() * height]);

  const path = (x: number, h: number) => {
    const w = h * SLOPE;
    return `M ${x - w} -1 l ${w} ${h} l ${w} ${-h} Z`;
  };

  const front = peaks(32, 256, 96);
  const back = peaks(32, 128, 64);

  let scroll = 0;
</script>

<svelte:window bind:scrollY={scroll} />

<svg width="100%" height="192" xmlns="http://www.w3.org/2000/svg">
  <g transform="matrix(1, 0, 0, -1, 0, 192)">
    {#each back as [x, y]}
      <path fill="#875" d={path(x, Math.max(y + 16 - scroll / 2, 0))} />
    {/each}
    {#each front as [x, y]}
      <path fill="#504832" d={path(x, Math.max(0, y + 8 - scroll / 4))} />
    {/each}
  </g>
</svg>

<style>
  svg {
    @apply absolute -bottom-0;
    z-index: -10;
  }
</style>
