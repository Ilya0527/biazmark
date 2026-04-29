import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Editorial off-whites — like premium book stock
        ink: {
          900: "#0d0d10",   // body text
          800: "#1a1a1f",
          700: "#3a3a40",
          600: "#5a5a62",   // muted body
          500: "#8a8a8f",
          400: "#bdbcb6",
          300: "#e0ddd3",   // soft hairline borders
          200: "#eeebe1",
          100: "#f7f4ea",   // card surface
          50:  "#fdfcf8",   // page background
        },
        // Refined Anglo-editorial palette: deep navy (primary), warm coral (accent), soft sun (highlight)
        accent: {
          50:  "#fbe9e7",
          100: "#f8d4d0",
          400: "#e26356",
          500: "#dc4c3e",   // primary accent — warm coral red
          600: "#b73c30",
          700: "#7e2a22",
        },
        navy: {
          50:  "#e8eaf0",
          400: "#3a4566",
          500: "#1a2440",   // primary brand colour
          600: "#121a2f",
          700: "#0a1020",
        },
        sun: {
          400: "#f7d175",
          500: "#f4c14d",   // soft yellow highlight (used sparingly, for marker only)
        },
        success: "#1a7f4f",
        danger:  "#b73c30",
        warning: "#a47100",
      },
      fontFamily: {
        sans:    ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Instrument Serif"', "Georgia", "Times New Roman", "serif"],
        mono:    ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "soft":    "0 1px 2px rgba(13,13,16,0.04), 0 8px 24px rgba(13,13,16,0.06)",
        "soft-lg": "0 2px 4px rgba(13,13,16,0.05), 0 24px 48px rgba(13,13,16,0.08)",
        "ring":    "0 0 0 4px rgba(220,76,62,0.15)",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
