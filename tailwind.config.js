/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        paper: "#f8fafc",
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          500: "#2672ff",
          600: "#1759dc",
          900: "#102657"
        },
        mint: "#1dbf91",
        coral: "#ff6b5f",
        gold: "#f5b841"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.12)",
        lift: "0 18px 40px rgba(15, 23, 42, 0.16)"
      }
    }
  },
  plugins: []
};
