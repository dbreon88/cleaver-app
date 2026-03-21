import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blade: {
          bg: '#0a0a0a',
          surface: '#141414',
          border: '#2a2a2a',
          silver: '#c0c0c0',
          steel: '#8a8a8a',
          red: '#dc2626',
          'red-dim': '#991b1b',
        },
      },
    },
  },
  plugins: [],
};
export default config;
