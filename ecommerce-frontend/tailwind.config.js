/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "control room": grafite escuro + azul elétrico de acento.
        // Evitamos o clichê "e-commerce" (creme/terracota) de propósito —
        // esta é uma peça de portfólio sobre arquitetura distribuída,
        // então a UI se comporta como um painel de observabilidade.
        base: {
          950: "#0B0F14",
          900: "#111820",
          800: "#151D27",
          700: "#1E2733",
          600: "#2B3644",
        },
        ink: {
          100: "#EDEFF2",
          300: "#B7C0CC",
          500: "#7C8996",
        },
        accent: {
          DEFAULT: "#4C9EFF",
          soft: "#2E6FD9",
          glow: "#8FC1FF",
        },
        signal: {
          success: "#34D399",
          pending: "#F5A623",
          error: "#F5636B",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        packet: {
          "0%": { left: "0%", opacity: "0", transform: "translate(-50%, -50%) scale(0.6)" },
          "10%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
          "88%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
          "100%": { left: "100%", opacity: "0", transform: "translate(-50%, -50%) scale(0.6)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        rowFlash: {
          "0%": { backgroundColor: "rgba(76,158,255,0.25)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        packet: "packet 1.4s ease-in-out forwards",
        "pulse-ring": "pulseRing 1.2s ease-out forwards",
        "row-flash": "rowFlash 1.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
