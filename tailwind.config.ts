import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F6F1E7",
          dark: "#171612",
        },
        card: {
          DEFAULT: "#FFFDF8",
          dark: "#1F1E19",
        },
        ink: {
          DEFAULT: "#1B1A17",
          muted: "#6B665B",
          dark: "#F6F1E7",
          "muted-dark": "#A8A296",
        },
        rule: {
          DEFAULT: "#D9D1C0",
          dark: "#33312B",
        },
        vermilion: {
          DEFAULT: "#D9441F",
          light: "#FDF2EE",
          dark: "#BF3613",
        },
        done: {
          DEFAULT: "#2F7D4F",
          light: "#EDF7F1",
        },
        info: {
          DEFAULT: "#2B4C7E",
          light: "#EEF4FC",
        },
        highlight: {
          task: "#DBEAFE",
          "task-text": "#1E40AF",
          date: "#FFEDD5",
          "date-text": "#C2410C",
          resource: "#DCFCE7",
          "resource-text": "#166534",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Instrument Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        tamil: ["var(--font-tamil)", "Noto Sans Tamil", "sans-serif"],
      },
      boxShadow: {
        paper: "0 1px 3px rgba(27, 26, 23, 0.06), 0 1px 2px rgba(27, 26, 23, 0.04)",
        "paper-hover": "0 4px 14px rgba(27, 26, 23, 0.08), 0 2px 4px rgba(27, 26, 23, 0.04)",
        "paper-lg": "0 8px 24px rgba(27, 26, 23, 0.09), 0 3px 6px rgba(27, 26, 23, 0.05)",
      },
      borderRadius: {
        paper: "10px",
      },
    },
  },
  plugins: [],
};

export default config;

