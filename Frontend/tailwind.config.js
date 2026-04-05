/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dot-pattern':
          'radial-gradient(circle, #6366f1 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-pattern': '24px 24px',
      },
      animation: {
        pulseSlow: 'pulse 6s infinite',
      }
    },
  },
  plugins: [],
}