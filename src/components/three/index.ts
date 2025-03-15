'use client'

// Main component
export { Scene } from './ThreeCanvas'

// Core components
export { SceneManager, CameraManager } from './core'

// Experiences
export { TetheredCard } from './experiences/TetheredCard'
export { Pinhead } from './experiences/TetheredCard/components'

// Components
export { Environment, ModelWrapper, Particles, ShaderBackground } from './components'

// Context providers and hooks
export {
  SceneProvider,
  ConfigProvider,
  EnvironmentProvider,
  LoadingProvider,
  useLoading,
  useSceneContext,
  useConfigContext,
  useEnvironment,
  type LoadingContextType,
} from './context'

// Viewport components
export { LoadingTracker } from './viewport/ThreeLoadingTracker'
export { ViewportManager } from './viewport/ViewportManager'

// Hooks
export * from './hooks'
