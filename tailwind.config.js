/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#fdf4f1",
          100: "#fbe6de",
          200: "#f5c7b4",
          300: "#eca386",
          400: "#dd7753",
          500: "#c2572a",
          600: "#a8451e",
          700: "#8a3718",
          800: "#6e2c15",
          900: "#592412",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
