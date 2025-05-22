// tailwind.config.js
export default {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa',
        foreground: '#012a4a',
        lightwhite: '#F8F9FE',
        softwhite: '#EAECF0',
        yellow: '#F9CD51',
        lightblue: '#F9FBFF',
        softblue: '#A9D6E5',
        mildblue: '#deebfd',
        darkgray: '#8594a2',
        green: '#84ccae',
        primary: {
          light: '#eef8ff',
          default: '#012a4a',
        },
        danger: {
          50: '#fff2f1',
          100: '#ffe3e1',
          light: '#ffcbc8',
          default: '#fe5f55',
        },
        success: {
          50: '#edfcf6',
          100: '#d4f7e7',
          light: '#adedd3',
          default: '#5dd0ac',
        },
        forms: {
          stroke: '#007AFF',
          placeholder: '#8F9098',
        },
      },
      fontSize: {
        base: '12px',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        button_shadow: '-3px 3px 0px 0px #F9CD51',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
