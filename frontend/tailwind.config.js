module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--paper) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",

        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
        },

        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          fg: "rgb(var(--primary-fg) / <alpha-value>)",
        },

        haze: "rgb(var(--haze) / <alpha-value>)",
        glow: "rgb(var(--glow) / <alpha-value>)",
        teal: "#14b8a6", // Keeping for compatibility if used directly
      },
      boxShadow: {
        soft: "0 12px 40px -10px rgb(0 0 0 / 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-space)", "sans-serif"],
      }
    },
  },
  plugins: [],
};