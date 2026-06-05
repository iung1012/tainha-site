/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A1628',
          light:   '#12243F',
          lighter: '#1E3A5F',
        },
        cream: {
          DEFAULT: '#F4ECD6',
          light:   '#FAF8F3',
          dark:    '#E2D0A8',
        },
        gold: {
          DEFAULT: '#C8A84B',
          light:   '#E4C96E',
          dark:    '#9A7A1A',
        },
        ocean: {
          DEFAULT: '#1B6CA8',
          light:   '#2D9CDB',
        },
        ember: '#C23B22',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        caps: '0.18em',
      },
      fontSize: {
        'fluid-hero': 'clamp(4.5rem, 13vw, 13rem)',
        'fluid-xl':   'clamp(2.5rem, 5vw, 5rem)',
        'fluid-lg':   'clamp(1.75rem, 3vw, 3rem)',
      },
      transitionDuration: { DEFAULT: '250ms' },
      opacity: { 6: '0.06', 8: '0.08', 12: '0.12', 15: '0.15', 35: '0.35', 45: '0.45', 55: '0.55', 65: '0.65' },
    },
  },
  plugins: [],
};
