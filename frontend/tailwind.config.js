/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#f9fbfe",
          200: "#e6e9ed",
          600: "#7b7b7b",
          800: "#1e1e1e"
        },
        purple: {
          200: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca"
        }
      }
    },
  },
  plugins: [],
}
