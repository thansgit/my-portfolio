# Three.js Hooks Directory

This directory contains shared global hooks for the Three.js experience.

## Context Hooks

### useSceneContext

Provides access to shared visual state across the scene, including:

- Card position and glow state
- Pinhead position and glow state
- Rope visuals (color, radius)
- Rotation counters

```tsx
const { cardPosition, isCardGlowing, setCardGlowing } = useSceneContext()
```

### useConfigContext

Provides access to configuration settings for the entire application:

- Physics parameters
- Visual settings
- Particle settings
- Color schemes

```tsx
const config = useConfigContext()
const maxSpeed = config.cardPhysics.maxSpeed
```

### useEnvironmentContext

Manages environment-specific state:

- Lighting settings
- Background settings
- Environment effects

```tsx
const { updatePinheadState, isPinheadGlowing } = useEnvironmentContext()
```

## Viewport Hooks

### useViewport

Provides viewport information and responsive utilities:

- Device type detection (mobile/desktop)
- Visibility state
- Viewport dimensions

```tsx
const { isMobile, isVisible, viewportWidth } = useViewport()
```

### useCamera

Camera management utilities:

- Camera positioning
- Focus points
- Animation controls

```tsx
const { setCameraTarget, animateCameraTo } = useCamera()
```

## Loading Hook

### useLoading

Tracks loading state for the application:

- Global loading state
- Component-specific loading

```tsx
const { isLoading, setLoadingComplete } = useLoading()
```

## Experience-Specific Hooks

Experience-specific hooks are now located in their respective experience directories:

- `src/components/three/experiences/TetheredCard/hooks/usePhysics.ts`
- `src/components/three/experiences/TetheredCard/hooks/useControls.ts`

Each experience has its own hooks for:

- Physics simulation
- Input handling
- Animation
- State management

## Best Practices

1. **Context Separation**: Keep contexts focused on specific concerns.
2. **Performance**: Use memoization for expensive calculations.
3. **Cleanup**: Always return cleanup functions from hooks that create resources.
4. **Typing**: Provide proper TypeScript types for all hooks.
5. **Documentation**: Document parameters and return values.
6. **'use client' Directive**: Hooks don't need 'use client' directives, as they inherit this from their usage.

## Adding New Hooks

When adding new hooks:

1. For global hooks used across experiences, add them to this directory
2. For experience-specific hooks, add them to the experience's hooks directory
3. Export all hooks through appropriate index.ts files
4. Provide TypeScript types for all parameters and return values
