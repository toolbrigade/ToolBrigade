import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#EAF2EF",
          100: "#d4e8e1",
          200: "#a9d1c3",
          300: "#7ebaa5",
          400: "#4F9A82",
          500: "#3a7d68",
          600: "#1E5F4E",
          700: "#194f41",
          800: "#133d32",
          900: "#0d2b23",
          950: "#17332A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        base: ["1rem", { lineHeight: "1.7" }],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
