const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  mode: 'jit',
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cabin", "Barlow", ...defaultTheme.fontFamily.sans],
        mono: ["Inconsolata", ...defaultTheme.fontFamily.mono],
        serif: ["Lora", ...defaultTheme.fontFamily.mono],
      },
      colors: Object.fromEntries(
        Object.entries(colors).map(([k, v]) => [k.toLowerCase(), v])
      ),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
