/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1ee',
          100: '#ffe4dd',
          200: '#ffccbe',
          300: '#ffa792',
          400: '#ff7455',
          500: '#eb3514', // Zernio primary red/orange
          600: '#d92506',
          700: '#b61b04',
          800: '#941908',
          900: '#7a1a0d',
        }
      }
    },
  },
  plugins: [],
}
