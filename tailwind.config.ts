/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: "#E7000B",
        "near-black": "#050505",
        "dark-surface": "#0B0B0B",
        elevated: "#111111",
        "light-text": "#F7F7F7",
        "soft-grey": "#A9A9A9",
        "muted-grey": "#A9A9A9",
        "data-blue": "#2C7BFF",
        "border-grey": "rgba(255,255,255,0.12)",
        "red-border": "rgba(231,0,11,0.55)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1320px",
        content: "1320px",
      },
      boxShadow: {
        panel: "0 16px 40px rgba(0,0,0,0.38)",
        float: "0 22px 50px rgba(0,0,0,0.42)",
        lift: "0 10px 24px rgba(0,0,0,0.28)",
      },
    },
  },
  plugins: [],
};
