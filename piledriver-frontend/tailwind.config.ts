import type { Config } from 'tailwindcss'
// import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        custom: ['Montserrat', 'Montserrat Alternates', 'Atkinson Hyperlegible'],
        sans: '"Atkinson Hyperlegible", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        serif: '"Montserrat Alternates", "Fantasque Sans Mono"'
      },
      colors: {
        'dodger-blue': {
          50: '#eff8ff',
          100: '#dbedfe',
          200: '#c0e1fd',
          300: '#94cffc',
          400: '#62b4f8',
          500: '#3590f3',
          600: '#2877e8',
          700: '#1f61d6',
          800: '#204fad',
          900: '#1f4689',
          950: '#182b53'
        },
        'malibu': {
          50: '#f1f9fe',
          100: '#e2f1fc',
          200: '#bfe3f8',
          300: '#86cdf3',
          400: '#62bfed',
          500: '#1e9bd9',
          600: '#117bb8',
          700: '#0f6395',
          800: '#10537c',
          900: '#134667',
          950: '#0d2d44'
        },
        'tango': {
          50: '#fef7ee',
          100: '#fdecd7',
          200: '#fad6ae',
          300: '#f6b87b',
          400: '#f19046',
          500: '#ee7b30',
          600: '#de5918',
          700: '#b84316',
          800: '#933619',
          900: '#762f18',
          950: '#40150a'
        },

        'energy-yellow': {
          50: '#fefce8',
          100: '#fff9c2',
          200: '#ffef89',
          300: '#ffe156',
          400: '#fdca12',
          500: '#ecb006',
          600: '#cc8702',
          700: '#a35f05',
          800: '#864b0d',
          900: '#723d11',
          950: '#431f05'
        },
        'chathams-blue': {
          50: '#f3f7fc',
          100: '#e7eff7',
          200: '#c9ddee',
          300: '#9ac1df',
          400: '#63a0cd',
          500: '#3f85b8',
          600: '#2e6a9b',
          700: '#26547c',
          800: '#234869',
          900: '#223e58',
          950: '#17283a'
        },
        'golden-tainoi': {
          50: '#fffaeb',
          100: '#fff0c6',
          200: '#ffdf88',
          300: '#ffd166',
          400: '#ffb220',
          500: '#f98f07',
          600: '#dd6802',
          700: '#b74706',
          800: '#94360c',
          900: '#7a2e0d',
          950: '#461502'
        },
        'crocodile': {
          50: '#f4f3f1',
          100: '#e8e6df',
          200: '#d3d0c3',
          300: '#b7b29f',
          400: '#9c977f',
          500: '#79745c',
          600: '#65614b',
          700: '#4f4c3c',
          800: '#413f33',
          900: '#39382e',
          950: '#1d1c16'
        }
      }
    }
  }
}
