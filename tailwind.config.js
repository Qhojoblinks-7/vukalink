/** @type {import('tailwindcss').Config} */
export default {
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
      colors: {
        // VukaLink Primary Brand Colors (Blues)
        vuka: { // Changed from 'linkup' to 'vuka' to align with VukaLink
          DEFAULT: '#2D72F3', // The core VukaLink Blue
          'lightest': '#eef6ff',
          'lighter': '#d7eaff',
          'light': '#adcffc',
          'base-light': '#83b4fa',
          'base': '#5a99f7',
          'strong': '#307ef5',
          'dark': '#2D72F3', // Default shade (same as DEFAULT)
          'darker': '#155bb4',
          'darkest': '#104481',
          'deep': '#0b2e4d',
          'deeper': '#061726',
        },
        // VukaLink Accent Colors (for highlights, success, warnings)
        'vuka-success': '#3EDD86',   // For positive actions, success messages
        'vuka-warning': '#FF8C00',   // For alerts, highlights
        'vuka-danger': '#dc3545',    // For errors, critical actions
        
        // VukaLink Neutral Colors (for text, backgrounds, borders)
        'vuka-white': '#FFFFFF',      // Pure white, for clean backgrounds
        'vuka-off-white': '#F8F9FA',  // Very light grey
        'vuka-light-grey': '#E9ECEF', // Light grey for borders, subtle backgrounds
        'grey-500 ': '#ADB5BD', // Medium grey for secondary text
        'vuka-dark-grey': '#343A40',   // Default text color
        'vuka-text': '#212529',       // Main body text, a rich dark grey
        'vuka-black': '#0B0B0B',      // Near black for strong headings/elements
        
        // Specific semantic colors for main backgrounds (optional, can use vuka-white/off-white)
        'vuka-background': '#F8F9FA', // A very subtle off-white for main page backgrounds
      },
    },
  },
  plugins: [],
}