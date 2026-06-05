/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:   '#080808',
        parch: '#F5F0E6',
        gold:  '#C8A84B',
        ember: '#C13A2E',
        mist:  '#1A1A18',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        marquee:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-33.33%)' } },
        'fade-up': { from: { opacity: 0, transform: 'translateY(28px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'img-in': { from: { opacity: 0, transform: 'scale(1.04)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
      animation: {
        marquee:  'marquee 28s linear infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'img-in': 'img-in 0.35s ease forwards',
      },
    },
  },
  plugins: [],
};
