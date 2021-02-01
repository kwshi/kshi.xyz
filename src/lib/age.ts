// because i can :)
const now = new Date();
const year = now.getFullYear();
const birthday = new Date(year, 8, 13);
export const age = year - 1998 - +(now < birthday);
