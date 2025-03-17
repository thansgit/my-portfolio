/**
 * Theme Configuration
 *
 * Central source for all styling variables and utilities.
 */

// Base colors for the dark theme
export const neuColors = {
  // Main background and surface colors
  base: {
    bg: '#252730', // Main background
    bgLight: '#2e3039', // Lighter variation
    bgDark: '#1c1e24', // Darker variation
    surface: '#2a2c36', // Container surfaces
  },

  // Secondary color palette for UI elements
  secondary: {
    main: '#2c3e50', // Secondary elements
    light: '#34495e',
    dark: '#1a252f',
  },

  // Accent/highlight color
  accent: {
    main: '#D35400', // Burnt orange
    light: '#E67E22', // Lighter burnt orange
    dark: '#A04000', // Darker burnt orange
  },

  // Text colors
  text: {
    primary: '#E6E6E6',
    secondary: '#B8B8B8',
    muted: '#8F8F8F',
  },

  // State colors
  state: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
}

// Shadow settings for 3D effects
export const neuShadows = {
  // Shadow colors - transparency is important for the effect
  light: 'rgba(255, 255, 255, 0.05)', // Subtle light shadow
  dark: 'rgba(0, 0, 0, 0.5)', // Stronger dark shadow

  // Shadow distances - controls the perceived depth
  distance: {
    xs: '2px', // Extra small depth
    sm: '4px', // Small depth
    md: '8px', // Medium depth
    lg: '12px', // Large depth
    xl: '16px', // Extra large depth
  },

  // Shadow blur radius - controls the softness
  blur: {
    xs: '4px', // Very sharp shadow
    sm: '8px', // Sharper shadow
    md: '16px', // Standard shadow
    lg: '24px', // Soft shadow
    xl: '32px', // Very soft shadow
  },
}

// Border radius values for consistent rounded corners
export const neuRadius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
}

// Animation durations for consistent transition times
export const neuAnimations = {
  transition: {
    fast: '150ms',
    default: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// Spacing values for consistent layout spacing
export const neuSpacing = {
  '0': '0',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
}

// Generate shadow styles
export const createNeuShadow = (
  type: 'flat' | 'pressed' | 'concave' | 'convex',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md',
) => {
  const { light, dark } = neuShadows
  const distance = neuShadows.distance[size]
  const blur = neuShadows.blur[size]

  if (type === 'flat') {
    return `${distance} ${distance} ${blur} ${dark}, -${distance} -${distance} ${blur} ${light}`
  }

  if (type === 'pressed') {
    return `inset ${distance} ${distance} ${blur} ${dark}, inset -${distance} -${distance} ${blur} ${light}`
  }

  if (type === 'concave') {
    const innerDistance =
      size === 'xs' ? '1px' : size === 'sm' ? '2px' : size === 'md' ? '4px' : size === 'lg' ? '6px' : '8px'
    const innerBlur =
      size === 'xs' ? '2px' : size === 'sm' ? '4px' : size === 'md' ? '8px' : size === 'lg' ? '12px' : '16px'

    return `${distance} ${distance} ${blur} ${dark}, -${distance} -${distance} ${blur} ${light}, inset ${innerDistance} ${innerDistance} ${innerBlur} ${dark}, inset -${innerDistance} -${innerDistance} ${innerBlur} ${light}`
  }

  if (type === 'convex') {
    const innerDistance =
      size === 'xs' ? '1px' : size === 'sm' ? '2px' : size === 'md' ? '4px' : size === 'lg' ? '6px' : '8px'
    const innerBlur =
      size === 'xs' ? '2px' : size === 'sm' ? '4px' : size === 'md' ? '8px' : size === 'lg' ? '12px' : '16px'

    return `${distance} ${distance} ${blur} ${dark}, -${distance} -${distance} ${blur} ${light}, inset -${innerDistance} -${innerDistance} ${innerBlur} ${dark}, inset ${innerDistance} ${innerDistance} ${innerBlur} ${light}`
  }

  return ''
}

// Generate text shadow styles for 3D text effects
export const createNeuTextShadow = (
  color: string = neuColors.accent.main,
  intensity: 'low' | 'medium' | 'high' = 'medium',
) => {
  const darkColor = 'rgba(0, 0, 0, 0.7)'
  const lightColor = `rgba(255, 255, 255, 0.15)`
  const accentColor = color ? `${color}33` : `${neuColors.accent.main}33` // 20% opacity

  // Shadow configurations based on intensity
  const shadowConfig = {
    low: {
      darkOffset: '1px',
      lightOffset: '-1px',
      blur: '1px',
      glowBlur: '6px',
    },
    medium: {
      darkOffset: '2px',
      lightOffset: '-1px',
      blur: '1px',
      glowBlur: '10px',
    },
    high: {
      darkOffset: '3px',
      lightOffset: '-2px',
      blur: '2px',
      glowBlur: '15px',
    },
  }

  const config = shadowConfig[intensity]

  return `
    ${config.darkOffset} ${config.darkOffset} ${config.blur} ${darkColor},
    ${config.lightOffset} ${config.lightOffset} ${config.blur} ${lightColor},
    0 0 ${config.glowBlur} ${accentColor}
  `
}

// CSS class definitions for components
export const neuCSS = {
  // Button variants
  button: {
    base: `rounded-neu-md relative font-medium transition-all duration-${neuAnimations.transition.default}`,
    default: `neu-button`,
    accent: `neu-button neu-button-accent`,
    pressed: `translate-y-1 transform`,
    flat: `bg-neu-surface text-neu-text`,
    disabled: `opacity-50 cursor-not-allowed`,
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    },
  },

  // Container variants
  container: {
    base: `rounded-neu-lg overflow-hidden`,
    default: `neu-container`,
    pressed: `neu-container-pressed`,
    withPadding: `p-6`,
  },

  // Input field variants
  input: {
    base: `w-full rounded-neu-md px-4 py-2 text-neu-text transition-all duration-${neuAnimations.transition.default}`,
    default: `neu-input`,
    focus: `ring-2 ring-neu-accent/20 outline-none`,
    withIcon: `pl-10`,
    withLabel: `mt-1`,
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    },
  },

  // Section styling
  section: {
    base: `mb-8 pb-${neuSpacing[6]}`,
    title: `text-xl font-semibold text-neu-accent mb-6`,
  },

  // Icon styling
  icon: {
    base: `text-neu-textOnAccent inline-flex items-center justify-center`,
    default: `neu-icon`,
    sizes: {
      sm: 'w-8 h-8 p-1.5',
      md: 'w-10 h-10 p-2',
      lg: 'w-12 h-12 p-2.5',
    },
  },

  // Timeline styling
  timeline: {
    base: `relative border-l-2 border-neu-bgLight pl-6 ml-6`,
    item: `mb-8 relative`,
    dot: `absolute -left-[35px] rounded-full bg-neu-bgLight w-6 h-6 flex items-center justify-center`,
    dotHighlight: `bg-gradient-to-br from-neu-accentLight to-neu-accentDark`,
    content: `neu-container p-4`,
  },

  // Link styling
  link: {
    base: `neu-link`,
  },

  // Text styling
  text: {
    base: `text-neu-text`,
    secondary: `text-neu-textSecondary`,
    muted: `text-neu-textMuted`,
    accent: `text-neu-accent`,
  },
}

// Complete theme object
export const neuTheme = {
  colors: neuColors,
  shadows: neuShadows,
  radius: neuRadius,
  animations: neuAnimations,
  spacing: neuSpacing,
  css: neuCSS,

  // Utility functions
  utils: {
    createShadow: createNeuShadow,
    createTextShadow: createNeuTextShadow,
  },
}

// Function to convert hex to RGB values for CSS variables
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return ''
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

// Initialize CSS variables from theme colors
export const initThemeColors = (): void => {
  if (typeof document === 'undefined') return // Skip during SSR

  // Create color variables
  document.documentElement.style.setProperty('--neu-bg', hexToRgb(neuColors.base.bg))
  document.documentElement.style.setProperty('--neu-bg-light', hexToRgb(neuColors.base.bgLight))
  document.documentElement.style.setProperty('--neu-bg-dark', hexToRgb(neuColors.base.bgDark))
  document.documentElement.style.setProperty('--neu-surface', hexToRgb(neuColors.base.surface))

  document.documentElement.style.setProperty('--neu-secondary', hexToRgb(neuColors.secondary.main))
  document.documentElement.style.setProperty('--neu-secondary-light', hexToRgb(neuColors.secondary.light))
  document.documentElement.style.setProperty('--neu-secondary-dark', hexToRgb(neuColors.secondary.dark))

  document.documentElement.style.setProperty('--neu-accent', hexToRgb(neuColors.accent.main))
  document.documentElement.style.setProperty('--neu-accent-light', hexToRgb(neuColors.accent.light))
  document.documentElement.style.setProperty('--neu-accent-dark', hexToRgb(neuColors.accent.dark))

  document.documentElement.style.setProperty('--neu-text', hexToRgb(neuColors.text.primary))
  document.documentElement.style.setProperty('--neu-text-secondary', hexToRgb(neuColors.text.secondary))
  document.documentElement.style.setProperty('--neu-text-muted', hexToRgb(neuColors.text.muted))
}
