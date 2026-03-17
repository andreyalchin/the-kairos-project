import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#3730A3',
          50: '#EEEDFC', 100: '#D4D3F8', 200: '#A9A7F1',
          300: '#7E7CEA', 400: '#5350E4', 500: '#3730A3',
          600: '#2C2683', 700: '#211C63', 800: '#161242', 900: '#0B0921',
        },
        teal: {
          DEFAULT: '#0F766E',
          50: '#E6F7F6', 100: '#C0EBE8', 200: '#81D7D1',
          300: '#42C3BB', 400: '#1FA89F', 500: '#0F766E',
          600: '#0C5E58', 700: '#094742', 800: '#062F2C', 900: '#031816',
        },
        blue: { DEFAULT: '#2563EB' },
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        text: { DEFAULT: '#1E293B', muted: '#64748B' },
      },
      fontFamily: {
        sans: ['var(--font-geist)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}
export default config
