/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#E8ECF4',
          100: '#C5CFE3',
          500: '#1B2E5E',
          600: '#0A1E4A',
          700: '#060F2A',
          900: '#040C1F',
        },
        gold: {
          300: '#E8C97A',
          400: '#D4A843',
          500: '#C9A84C',
          600: '#A8872E',
        },
      },
    },
  },
  plugins: [],
}