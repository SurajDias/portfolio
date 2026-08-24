import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        surface: "#0b0f19",
        "surface-glass": "rgba(15, 23, 42, 0.65)",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
        "text-primary": "#f8fafc",
        "text-muted": "#94a3b8",
        accent: "#38bdf8",
        "accent-glow": "rgba(56, 189, 248, 0.15)",
        "hero-base": "#050816",
        "glass-fill": "rgba(15, 23, 42, 0.65)",
        "glass-border": "rgba(255, 255, 255, 0.08)",
        scrim: "rgba(5, 8, 22, 0.65)",
      },
      fontSize: {
        display: [
          "3.75rem",
          { lineHeight: "1.08", letterSpacing: "-0.035em", fontWeight: "800" },
        ],
        h1: [
          "2.75rem",
          { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        h2: [
          "2rem",
          { lineHeight: "1.25", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        "body-lg": [
          "1.125rem",
          { lineHeight: "1.6", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        body: [
          "0.9375rem",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
        ],
        caption: [
          "0.8125rem",
          { lineHeight: "1.5", letterSpacing: "0.015em", fontWeight: "500" },
        ],
      },
      spacing: {
        "section-sm": "6rem",  // 96px
        "section-md": "8rem",  // 128px
        "section-lg": "10rem", // 160px
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 0%), rgba(56, 189, 248, 0.12), transparent 80%)",
        "radial-corner":
          "radial-gradient(800px circle at 100% 0%, rgba(99, 102, 241, 0.14), rgba(56, 189, 248, 0.04) 45%, transparent 80%)",
        "radial-top":
          "radial-gradient(1000px circle at 50% -10%, rgba(99, 102, 241, 0.16), rgba(56, 189, 248, 0.05) 50%, transparent 80%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
