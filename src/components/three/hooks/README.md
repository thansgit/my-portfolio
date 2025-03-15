# Three.js Hooks Directory

This directory contains shared global hooks for the Three.js experience.

## Core Hooks

### useViewport

Provides viewport information and responsive utilities:

- Device type detection (mobile/desktop)
- Visibility state
- Viewport dimensions
- Responsive breakpoints

```tsx
const { isMobile, isVisible, viewportWidth, viewportHeight } = useViewport()
```

### useCamera

Camera management utilities:

- Camera positioning
- Focus points
- Animation controls

```tsx
const { setCameraTarget, animateCameraTo } = useCamera()
```

## Context Hooks

The following hooks are imported from the context directory:

### useConfig

```tsx
import { useConfig } from '@/components/three/context'

// In component
const config = useConfig()
const maxSpeed = config.physics.maxSpeed
```

Provides access to configuration settings for the entire application:

- Physics parameters
- Visual settings
- Particle settings
- Color schemes

### useScene

```tsx
import { useScene } from '@/components/three/context'

// In component
const { updateSceneState, sceneState } = useScene()
```

Provides access to shared visual state across the scene.

### useEnvironment

```tsx
import { useEnvironment } from '@/components/three/context'

// In component
const { updateLighting, environment } = useEnvironment()
```

Manages environment-specific state:

- Lighting settings
- Background settings
- Environment effects

### useLoading

```tsx
import { useLoading } from '@/components/three/context'

// In component
const { isLoaded, setLoaded } = useLoading()
```

Tracks loading state for the application:

- Global loading state
- Asset loading progress

## Experience-Specific Hooks

Experience-specific hooks are located in their respective experience directories:

- `src/components/three/experiences/TetheredCard/hooks/`

Each experience has its own hooks for:

- Physics simulation
- Input handling
- Animation
- State management

## Best Practices

1. **Context Separation**: Keep contexts focused on specific concerns
2. **Performance**: Use memoization for expensive calculations
3. **Cleanup**: Always return cleanup functions from hooks that create resources
4. **Typing**: Provide proper TypeScript types for all hooks
5. **Reusability**: Design hooks to be reusable when possible
6. **'use client' Directive**: Hooks don't need 'use client' directives, as they inherit this from their usage

## Adding New Hooks

When adding new hooks:

1. For global hooks used across experiences, add them to this directory
2. For experience-specific hooks, add them to the experience's hooks directory
3. Export all hooks through appropriate index.ts files
4. Provide TypeScript types for all parameters and return values
