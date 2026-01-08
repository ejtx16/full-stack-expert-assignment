/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Navy color palette from hex.PNG
        primary: {
          50: '#E0E1DD',   // Lightest - off-white
          100: '#C6C9C4',
          200: '#A8ADB5',
          300: '#8A95A5',
          400: '#778DA9',  // Muted blue-gray
          500: '#5C7391',
          600: '#415A77',  // Slate blue - main accent
          700: '#344966',
          800: '#1B263B',  // Dark navy
          900: '#141E30',
          950: '#0D1B2A',  // Darkest navy
        },
        accent: {
          50: '#E0E1DD',
          100: '#D1D3CF',
          200: '#B3B7B2',
          300: '#959B95',
          400: '#778DA9',
          500: '#5C7391',
          600: '#415A77',
          700: '#344966',
          800: '#1B263B',
          900: '#141E30',
          950: '#0D1B2A',
        },
        // Semantic colors using the palette
        navy: {
          50: '#E0E1DD',
          100: '#C6C9C4',
          200: '#A8ADB5',
          300: '#8A95A5',
          400: '#778DA9',
          500: '#5C7391',
          600: '#415A77',
          700: '#344966',
          800: '#1B263B',
          900: '#141E30',
          950: '#0D1B2A',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(65, 90, 119, 0.4)',
        'glow-accent': '0 0 20px rgba(119, 141, 169, 0.3)',
        'glow-soft': '0 0 30px rgba(65, 90, 119, 0.2)',
      },
    },
  },
  plugins: [],
};

