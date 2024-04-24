/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        c0: "#101010",
        c1: "#131313",
        c2: "#202329",
        c3: "#8B8D93",
        c4: "#6b8afd",
        c5: "#2E343D",
        pink: "#da2f68",
        black1: "#04152d",
        black2: "#041226",
        black3: "#020c1b",
        blackLighter: "#1c4b91",
        blackLight: "#173d77",
        orange: "#f89e00",
        gradient: "linear-gradient(98.37deg, #f89e00 0.99%, #da2f68 100%)",
      },
      boxShadow: {
        boxShadow: "0 0 0.625em #da2f68",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}