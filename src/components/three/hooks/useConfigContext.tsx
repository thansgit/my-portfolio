'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import {
  ROPE_INITIAL_RADIUS,
  PINHEAD_SIZE,
  PINHEAD_COLOR,
  CARD_DEFAULT_MAX_SPEED,
  CARD_DEFAULT_MIN_SPEED,
} from '../utils/constants'

// Configuration interface that contains settings and theme options
interface ConfigContextState {
  // Physics settings
  cardPhysics: {
    maxSpeed: number
    minSpeed: number
  }

  // Visual settings
  ropeStyling: {
    initialRadius: number
    minRadius: number
    colorStretchSpeed: number
    radiusStretchSpeed: number
  }

  // Particle settings
  particleSettings: {
    size: number
    count: number
  }

  // Colors and themes
  colors: {
    pinhead: string
    ropeDefault: string
  }
}

// Create the context with default values from constants
export const ConfigContext = createContext<ConfigContextState>({
  cardPhysics: {
    maxSpeed: CARD_DEFAULT_MAX_SPEED,
    minSpeed: CARD_DEFAULT_MIN_SPEED,
  },

  ropeStyling: {
    initialRadius: ROPE_INITIAL_RADIUS,
    minRadius: ROPE_INITIAL_RADIUS * 0.3,
    colorStretchSpeed: 10,
    radiusStretchSpeed: 5,
  },

  particleSettings: {
    size: 0.075,
    count: 200,
  },

  colors: {
    pinhead: PINHEAD_COLOR,
    ropeDefault: '#000000',
  },
})

interface ConfigProviderProps {
  children: ReactNode
  customConfig?: Partial<ConfigContextState>
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children, customConfig }) => {
  // Merge default config with any custom settings
  const defaultConfig: ConfigContextState = {
    cardPhysics: {
      maxSpeed: CARD_DEFAULT_MAX_SPEED,
      minSpeed: CARD_DEFAULT_MIN_SPEED,
    },

    ropeStyling: {
      initialRadius: ROPE_INITIAL_RADIUS,
      minRadius: ROPE_INITIAL_RADIUS * 0.3,
      colorStretchSpeed: 10,
      radiusStretchSpeed: 5,
    },

    particleSettings: {
      size: 0.075,
      count: 200,
    },

    colors: {
      pinhead: PINHEAD_COLOR,
      ropeDefault: '#000000',
    },
  }

  // Deep merge custom config with defaults
  const config = customConfig ? mergeDeep(defaultConfig, customConfig) : defaultConfig

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

// Custom hook to use the config context
export const useConfigContext = () => {
  return useContext(ConfigContext)
}

// Utility function for deep merging objects
function mergeDeep(target: any, source: any) {
  const output = { ...target }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}
