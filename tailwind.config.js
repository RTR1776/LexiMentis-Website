module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66abff',
          400: '#338fff',
          500: '#0073ff',
          600: '#005ecb',
          700: '#0048a3',
          800: '#00306c',
          900: '#001835',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebeef5',
          200: '#d7deeb',
          300: '#c2cde0',
          400: '#aebdd6',
          500: '#99accc',
          600: '#7a8aa3',
          700: '#5c677a',
          800: '#3d4552',
          900: '#1f2229',
        },
        accent: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe799',
          300: '#ffdb66',
          400: '#ffcf33',
          500: '#ffc300',
          600: '#cc9c00',
          700: '#997500',
          800: '#664e00',
          900: '#332700',
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
