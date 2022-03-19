import { readable } from "svelte/store";

// because i can :)
const computeAge = (date: Date): number => {
  const year = date.getFullYear();
  const birthday = new Date(year, 8, 13); // month is 0-indexed, for some reason
  return year - 1998 - +(date < birthday);
};

export const age = readable(computeAge(new Date()), (set) => {
  const interval = setInterval(() => set(computeAge(new Date())), 3600e3);
  return () => clearInterval(interval);
});
