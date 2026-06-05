/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sea: {
          dark:    '#023E8A',
          DEFAULT: '#0077B6',
          mid:     '#0096C7',
          light:   '#48CAE4',
          pale:    '#CAF0F8',
        },
        ocean: {
          bg:     '#FAFCFF',
          subtle: '#EAF4FF',
        },
        ink:   '#0D1B2A',
        gold:  '#C8A84B',
        ember: '#C13A2E',
        mist:  '#1A3A5C',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        marquee:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-33.33%)' } },
        'img-in': { from: { opacity: '0', transform: 'scale(1.04)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        marquee:  'marquee 28s linear infinite',
        'img-in': 'img-in 0.35s ease forwards',
      },
    },
  },
  plugins: [],
};
