/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./.vitepress/**/*.{js,ts,vue}",
    "./components/**/*.{js,ts,vue}",
    "./content/**/*.md",
    "./index.md",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6d9e0b",
        secondary: "#2ecc71",
      },
    },
  },
  plugins: [],
};
