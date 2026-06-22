/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17202a',
        mist: '#eef4f8',
        teal: '#0f766e',
        coral: '#f97361'
      }
    }
  },
  plugins: []
};
