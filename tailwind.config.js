/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F79426', // Primary color
        primaryLight: '#FFA366', // Light shade of your primary color
        primaryDark: '#C7781F', // Dark shade of your primary color
        background: '#F1F3F6', // Whitish background
        backgroundDark: '#101010', // blackish background
      },
    },
  },
  plugins: [],
};
