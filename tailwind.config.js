/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary1: '#f4d928',
        primary2: '#009ddb',
        backgroundDay: '#ededff',
        backgroundNight: '#05244f',
        textPrimaryDay: '#333333',
        textPrimaryNight: '#ffffff',
      },
    },
  },
  plugins: [],
}
