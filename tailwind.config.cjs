/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        recording: {
          '0%,100%': { backgroundColor: 'rgba(255,0,0,1)' },
          '50%': { backgroundColor: 'rgba(255,0,0,0.3)' }
        }
      },
      animation: {
        'recording': 'recording 2s infinite',
      }
    }
  },
  plugins: [],
};

module.exports = config;
