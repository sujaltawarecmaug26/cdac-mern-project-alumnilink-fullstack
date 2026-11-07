/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F1',
        card: '#FFFFFF',
        sand: '#F1E3D3',
        primary: '#9F1239',
        wine: '#6B0F2A',
        gold: '#D97706',
        success: '#15803D',
        danger: '#B91C1C',
        info: '#2563EB',
        cocoa: '#2B1B17',
        muted: '#8B7766',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(43, 27, 23, 0.06)',
      },
    },
  },
  plugins: [],
};
