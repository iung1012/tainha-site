/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        sea: {
          DEFAULT: '#0077B6',
          light:   '#00B4D8',
          dark:    '#023E8A',
          accent:  '#90E0EF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)',
        'ocean-gradient-light': 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        wave:  'wave 12s linear infinite',
      },
    },
  },
  plugins: [],
};
