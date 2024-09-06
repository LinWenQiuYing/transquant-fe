/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "../../src/app/**/*.tsx",
    "../../src/common/**/*.tsx",
    "../../src/docs/**/*.tsx",
    "../../src/login/**/*.tsx",
    "../../src/manage/**/*.tsx",
    "../../src/person/**/*.tsx",
    "../../src/space/**/*.tsx",
    "../../src/data-engineering/**/*.tsx",
    "../../src/scheduler/**/*.tsx",
    "../../packages/ui/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        lightpink: "rgb(255, 249, 248)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
