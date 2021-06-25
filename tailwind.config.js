const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
    },
    fontFamily: {
      body: ['Inter', 'sans-serif'],
      display: ['Inter', 'sans-serif'],
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
