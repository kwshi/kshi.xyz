// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
export const normal = () => {
  // Math.random() ∈ [0,1)
  const r = Math.sqrt(-2 * Math.log(1 - Math.random()));
  const θ = 2 * Math.PI * Math.random();
  return r * Math.cos(θ);
};

export const shuffle = <T>(items: T[]): void => {
  for (let i = 0; i < items.length; ++i) {
    // randomly select among i,…,n-1
    const j = i + Math.floor(Math.random() * (items.length - i));

    const tmp = items[i]!;
    items[i] = items[j]!;
    items[j] = tmp;
  }
};

export const permutation = (n: number) => {
  const perm: number[] = [];
  for (let i = 0; i < n; ++i) perm.push(i);

  shuffle(perm);
  return perm;
};
