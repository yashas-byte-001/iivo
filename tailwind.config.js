export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 24px 80px rgba(0, 0, 0, 0.35)',
        soft: '0 18px 50px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
};