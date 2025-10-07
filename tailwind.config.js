export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'soft': '0 4px 12px 0 rgba(0, 0, 0, 0.07)',
        'medium': '0 8px 24px 0 rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px 0 rgba(79, 70, 229, 0.5)',
      },
    },
  },
  plugins: [],
};
