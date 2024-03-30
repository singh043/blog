/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
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
  plugins: [],
}