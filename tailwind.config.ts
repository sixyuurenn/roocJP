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
        "base-bg": "#f5f4f2",
        "base-text": "#1f2937",
        "base-accent": "#46607a",
      },
    },
  },
  plugins: [],
};

export default config;
