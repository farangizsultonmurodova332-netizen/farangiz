/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8fafc",
        haze: "#e2e8f0",
        glow: "#f97316",
        teal: "#14b8a6",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};