/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        vspin: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(360deg)' },
        },
      },
      animation: {
        vspin: 'vspin 1s linear infinite',
      },
      fontFamily: {
        // Define custom font families
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Lexend Deca"', 'sans-serif'],
      },
      // All custom vuka- colors removed. Use standard Tailwind colors instead.
    },
  },
  plugins: [],
}