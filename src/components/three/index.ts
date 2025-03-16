'use client'

// Main component
export { Scene } from './ThreeCanvas'

// Core components
export { SceneManager, CameraManager } from './core'

// Experiences
export { TetheredCard } from './experiences/TetheredCard'
export { Pinhead } from './experiences/TetheredCard/components'

// Components
export { Environment, ModelWrapper, ShaderBackground } from './components'

// Context providers and hooks
export { SceneProvider, useSceneContext } from './context/SceneContext'
export { ConfigProvider, useConfigContext } from './context/ConfigContext'
export { EnvironmentProvider, useEnvironment } from './context/EnvironmentContext'
export { LoadingProvider, useLoading, type LoadingContextType } from './context/LoadingContext'

// Viewport components
export { LoadingTracker } from './viewport/ThreeLoadingTracker'
export { ViewportManager } from './viewport/ViewportManager'
