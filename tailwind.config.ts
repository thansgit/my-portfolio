import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import { neuColors, neuRadius, createNeuShadow } from './src/lib/neumorphic'

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Neumorphic color palette
        neu: {
          // Base colors
          bg: neuColors.base.bg,
          bgLight: neuColors.base.bgLight,
          bgDark: neuColors.base.bgDark,
          surface: neuColors.base.surface,

          // Secondary colors
          secondary: neuColors.secondary.main,
          secondaryLight: neuColors.secondary.light,
          secondaryDark: neuColors.secondary.dark,

          // Accent colors
          accent: neuColors.accent.main,
          accentLight: neuColors.accent.light,
          accentDark: neuColors.accent.dark,

          // Text colors
          text: neuColors.text.primary,
          textSecondary: neuColors.text.secondary,
          textMuted: neuColors.text.muted,

          // Add text color variants for base colors (for clarity)
          textOnAccent: neuColors.base.bgDark, // Text on accent color (dark bg color)
          textOnLight: neuColors.base.bgDark, // Text on light surfaces
          textOnDark: neuColors.text.primary, // Text on dark surfaces
        },

        // State colors
        success: neuColors.state.success,
        error: neuColors.state.error,
        warning: neuColors.state.warning,
        info: neuColors.state.info,
      },
      borderRadius: {
        // Neumorphic border radius values
        'neu-xs': neuRadius.xs,
        'neu-sm': neuRadius.sm,
        'neu-md': neuRadius.md,
        'neu-lg': neuRadius.lg,
        'neu-xl': neuRadius.xl,
        'neu-2xl': neuRadius['2xl'],
      },
      boxShadow: {
        // Neumorphic shadows
        'neu-flat-xs': createNeuShadow('flat', 'xs'),
        'neu-flat-sm': createNeuShadow('flat', 'sm'),
        'neu-flat': createNeuShadow('flat', 'md'),
        'neu-flat-lg': createNeuShadow('flat', 'lg'),
        'neu-flat-xl': createNeuShadow('flat', 'xl'),

        'neu-pressed-xs': createNeuShadow('pressed', 'xs'),
        'neu-pressed-sm': createNeuShadow('pressed', 'sm'),
        'neu-pressed': createNeuShadow('pressed', 'md'),
        'neu-pressed-lg': createNeuShadow('pressed', 'lg'),
        'neu-pressed-xl': createNeuShadow('pressed', 'xl'),

        'neu-concave-xs': createNeuShadow('concave', 'xs'),
        'neu-concave-sm': createNeuShadow('concave', 'sm'),
        'neu-concave': createNeuShadow('concave', 'md'),
        'neu-concave-lg': createNeuShadow('concave', 'lg'),
        'neu-concave-xl': createNeuShadow('concave', 'xl'),

        'neu-convex-xs': createNeuShadow('convex', 'xs'),
        'neu-convex-sm': createNeuShadow('convex', 'sm'),
        'neu-convex': createNeuShadow('convex', 'md'),
        'neu-convex-lg': createNeuShadow('convex', 'lg'),
        'neu-convex-xl': createNeuShadow('convex', 'xl'),
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-roboto-mono)', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
