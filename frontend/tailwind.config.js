/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

const typography = {
  '.typo-dl': {
    fontWeight: '700',
    fontSize: '56px',
    lineHeight: '76px',
  },
  '.typo-hd1': {
    fontWeight: '700',
    fontSize: '36px',
    lineHeight: '49px',
  },
  '.typo-hd2': {
    fontWeight: '600',
    fontSize: '36px',
    lineHeight: '49px',
  },
  '.typo-hl1': {
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '33px',
  },
  '.typo-hl2': {
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '33px',
  },
  '.typo-shl1': {
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '28px',
  },
  '.typo-shl2': {
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '24px',
  },
  '.typo-shl3': {
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '25px',
  },
  '.typo-b1': {
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '22px',
  },
  '.typo-b2': {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '22px',
  },
  '.typo-b3': {
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
  },
  '.typo-b4': {
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '22px',
  },
  '.typo-c1': {
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
  },
  '.typo-c2': {
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '19px',
  },
  '.typo-c3': {
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '19px',
  },
  '.typo-d1': {
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
  },
  '.typo-th-hd1': {
    fontFamily: 'var(--font-noto-sans-thai)',
    fontWeight: '400',
    fontSize: '36px',
    lineHeight: '54px',
  },
  '.typo-th-hl1': {
    fontFamily: 'var(--font-noto-sans-thai)',
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '36px',
  },
  '.typo-th-hl2': {
    fontFamily: 'var(--font-noto-sans-thai)',
    fontWeight: '400',
    fontSize: '24px',
    lineHeight: '36px',
  },
  '.typo-th-hl3': {
    fontFamily: 'var(--font-noto-sans-thai)',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '28px',
  },
  '.typo-th-shl3': {
    fontFamily: 'var(--font-noto-sans-thai)',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '27px',
  },
  '.typo-th-b2': {
    fontFamily: 'var(--font-noto-sans-thai)',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '22px',
  },
  '.typo-th-c3': {
    fontFamily: 'var(--font-noto-sans-thai)',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
  },
  '.typo-th-d1': {
    fontFamily: 'var(--font-noto-sans-thai)',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
  },
}

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main: {
          white: '#FFFFFF',
          black: '#000000',
          orange: '#F17D23',
          red: '#EB2328',
          grey1: '#F1F1F1',
          grey2: '#DCDCDC',
          grey3: '#C5C5C5',
          grey4: '#979797',
          grey5: '#565656',
          grey6: '#3B3B3B',
          grey7: '#343434',
          grey8: '#2A2A2A',
        },
        tag: {
          orange: '#F17D23',
          'orange-bg': '#F9C7A0',
          blue: '#3160D5',
          'blue-bg': '#E2E7F2',
          purple: '#B3317D',
          'purple-bg': '#EFE2E9',
          green: '#88C941',
          'green-bg': '#EBF1E4',
          red: '#FE0000',
          'red-bg': '#F6DDDD',
          brown: '#8B3605',
          'brown-bg': '#F4EBE6',
        },
        alert: {
          success: '#88C941',
          'success-bg': '#EBF1E4',
        },
        accent: {
          'light-bg1': '#FDFDFD',
          'light-bg2': '#F6F6F6',
          grey: '#696969',
          'body-text': '#181818',
          'orange-bg1': '#FEF2E9',
          'orange-bg2': '#FCE0CA',
          'orange-bg3': '#F9C7AO',
        },
        support: {
          orange: '#F16624'
        },
      },
      fontFamily: {
        'noto-sans': ['var(--font-noto-sans)'],
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      // Add Typography component classes
      addComponents(typography)
    }),
  ],
}
