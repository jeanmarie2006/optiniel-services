/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        "paper-warm": "#F5F4F1",
        ink: "#0B0E14",
        navy: {
          DEFAULT: "#0F1B3D",
          light: "#1B2F5E",
        },
        cyan: "#00AEEF",
        magenta: "#EC008C",
        inkyellow: "#FFD400",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "mark-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(90deg)" },
        },
      },
      animation: {
        "mark-spin": "mark-spin 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
