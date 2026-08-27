/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A962',
          50: '#fdf8ee',
          100: '#f8edcf',
          200: '#f0d89d',
          300: '#e6be63',
          400: '#C9A962',
          500: '#b8954f',
          600: '#9a7a3e',
          700: '#7a5f2f',
          800: '#5a4522',
          900: '#3a2c14',
        },
        dark: {
          DEFAULT: '#1a1a1a',
          50: '#2a2a2a',
          100: '#222222',
          200: '#1a1a1a',
          300: '#141414',
          400: '#0f0f0f',
        },
        cream: {
          DEFAULT: '#f9f7f4',
          50: '#fdfcfa',
          100: '#f9f7f4',
          200: '#f0ece4',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest2': '0.2em',
        'widest3': '0.3em',
      },
      animation: {
        'slow-zoom': 'slowZoom 22s ease-in-out infinite alternate',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
