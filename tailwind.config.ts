import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0f1d44",
          700: "#182a5c",
          900: "#0a1430",
        },
        emerald: {
          700: "#0a6b4f",
          600: "#0e8a66",
          800: "#075640",
        },
        gold: {
          DEFAULT: "#ddb33c",
          300: "#ecd08a",
          100: "#f7edd6",
        },
        cream: "#faf8f4",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};
export default config;
