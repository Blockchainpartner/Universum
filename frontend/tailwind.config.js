/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('../public/background.png')",
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateY(0)' },
         
          '50%': { transform: 'translateY(-20px)' },
          
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'waving-hand': 'wave 3s linear infinite',
      },
    }
,fontFamily: {
  'poppins': ['Poppins'],
}
  },
  
  plugins: [],
}
