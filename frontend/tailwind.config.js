/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cocis-dark': '#1a1a2e',
        'cocis-primary': '#16213e',
        'cocis-accent': '#0f3460',
        'cocis-gold': '#e94560',
        'cocis-light': '#eaeaea',
      },
      fontFamily: {
        'academic': ['Georgia', 'serif'],
        'modern': ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'door-open': 'doorOpen 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        doorOpen: {
          '0%': { transform: 'scaleX(1)', opacity: '1' },
          '100%': { transform: 'scaleX(0)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
