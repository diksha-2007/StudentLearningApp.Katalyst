/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        katalyst: {
          50: "#f6f3ff",
          100: "#eeeafb",
          200: "#dcd5f5",
          300: "#c4b9eb",
          400: "#9b8bd1",
          500: "#6650a5",
          600: "#594594",
          700: "#49347f",
          800: "#3c2b68",
          900: "#302451",
          950: "#201833",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(82, 69, 131, 0.1)",
        "glass-lg": "0 16px 48px rgba(82, 69, 131, 0.16)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};