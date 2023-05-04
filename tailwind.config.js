/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003370',
        secondary: '#002248',
        light: '#69a4f3',
        selected: '#144e97',
        lightText: '#71a5e5',
      },
    },
  },
  plugins: [],
};
