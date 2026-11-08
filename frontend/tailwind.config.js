/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: '#E8A317',
        maroon: '#7A1F1F',
        cream: '#F9F4EA',
        ink: '#2A1D1D',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(122,31,31,0.12)',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
