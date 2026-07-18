import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // 60% — deep petroleum / dark teal family
        deep: {
          DEFAULT: "#0B2622",
          2: "#0F332E",
          3: "#143D37",
          soft: "#1B4941",
        },
        // 30% — warm white / cream / soft gray
        cream: {
          DEFAULT: "#F5F1E7",
          soft: "#EAE4D4",
          dim: "#DCD5C2",
        },
        // 10% — luxury gold accent
        gold: {
          DEFAULT: "#C9A24D",
          soft: "#E7CC8A",
          deep: "#A5813A",
        },
      },
      fontFamily: {
        vazir: ["var(--font-vazir)", "Tahoma", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.75rem, 5vw, 4.75rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        h2: ["clamp(2rem, 3.2vw, 3rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h3: ["clamp(1.375rem, 2vw, 1.75rem)", { lineHeight: "1.35" }],
        body: ["1.0625rem", { lineHeight: "1.9" }],
        caption: ["0.8125rem", { lineHeight: "1.6", letterSpacing: "0.08em" }],
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(11, 38, 34, 0.35)",
        gold: "0 10px 40px -10px rgba(201, 162, 77, 0.45)",
        glass: "0 8px 32px 0 rgba(11, 38, 34, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "70%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
        "wave-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 3.2s cubic-bezier(0.2, 0.7, 0.3, 1) infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-slower": "float-slower 9s ease-in-out infinite",
        "wave-flow": "wave-flow 8s linear infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
