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
          50:  "#FAF0EB",
          100: "#F5DDD3",
          200: "#EBBBA7",
          300: "#DF9478",
          400: "#D4714F",
          500: "#C75D3A",
          600: "#B34F2E",
          700: "#8F3D22",
          800: "#6B2D18",
          900: "#471D0F",
          950: "#1F1208",
        },
        green: {
          600: "#5B7553",
          700: "#4A6143",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
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
