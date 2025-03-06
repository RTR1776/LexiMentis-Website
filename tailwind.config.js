module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFE6E6',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF3333',
          500: '#D40000', // LexiMentis Red
          600: '#B30000',
          700: '#8F0000',
          800: '#6B0000',
          900: '#470000',
        },
        secondary: {
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#C2C2C2',
          300: '#A3A3A3',
          400: '#858585',
          500: '#666666',
          600: '#4D4D4D',
          700: '#333333',
          800: '#1A1A1A',
          900: '#0E0606', // Charcoal Black
        },
        accent: {
          50: '#EDF2F7',
          100: '#DCE6EF',
          200: '#B8C9DF',
          300: '#94ABCF',
          400: '#708EBF',
          500: '#4C70AF',
          600: '#3C5B8C',
          700: '#2C4369',
          800: '#2C3E50', // Slate Blue
          900: '#1A2530',
        },
        neutral: {
          50: '#FFFFFF',
          100: '#F7F7F7',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3', 
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
};
