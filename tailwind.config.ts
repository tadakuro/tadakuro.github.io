import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef7ff",
          100: "#d9edff",
          200: "#bce0ff",
          300: "#8ecdff",
          400: "#59b0ff",
          500: "#328dff",
          600: "#1b6df5",
          700: "#1458e1",
          800: "#1748b6",
          900: "#193f8f",
          950: "#142757"
        }
      }
    }
  },
  plugins: []
};

export default config;