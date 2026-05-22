import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        border: "var(--border)",
        "mono-bg": "var(--mono-bg)",
        yellow: "var(--yellow)",
        "yellow-light": "var(--yellow-light)",
        "yellow-dark": "var(--yellow-dark)",
        teal: "var(--teal)",
        "teal-light": "var(--teal-light)",
        coral: "var(--coral)",
        "coral-light": "var(--coral-light)",
        amber: "var(--amber)",
        "amber-light": "var(--amber-light)",
        "freeze-blue": "var(--freeze-blue)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "14px",
        pill: "100px",
      },
    },
  },
  plugins: [],
};

export default config;
