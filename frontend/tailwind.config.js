/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at 20% 20%, #4287f5, rgba(76, 0, 255, 0), rgba(76, 0, 255, 0), #83b0f7, rgba(76, 0, 255, 0))',
      }
    }
  },
  plugins: [],
}
