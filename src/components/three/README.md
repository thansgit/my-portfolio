# Three.js Components

This directory contains all Three.js related components organized in a logical structure:

## Directory Structure

```
src/components/three/
├── index.ts                  # Main exports
│
├── canvas/                   # Core canvas setup
│   ├── Scene.tsx             # Main Canvas component with context providers
│   └── ViewportManager.tsx   # Viewport and responsive layout management
│
├── experiences/              # Self-contained experiences
│   └── TetheredCard/         # Tethered Card experience
│       ├── index.tsx         # Main component
│       ├── components/       # Experience-specific components
│       │   ├── CardModel.tsx # Card model with materials
│       │   ├── DraggablePlane.tsx # Touch interaction surface
│       │   ├── Pinhead.tsx   # Pinhead visual component
│       │   └── RopeMesh.tsx  # Rope visualization
│       ├── hooks/            # Experience-specific hooks
│       │   ├── useControls.ts # Input and rotation tracking
│       │   └── usePhysics.ts # Physics simulation logic
│       └── utils/            # Experience-specific utilities
│           └── materials.ts  # Card material creation
│
├── shared/                   # Shared components across experiences
│   ├── Environment.tsx       # Lighting, background, and atmosphere
│   └── ModelWrapper.tsx      # Loading/error wrapper for models
│
├── effects/                  # Visual effects
│   └── Particles.tsx         # Particle system
│
├── utils/                    # Utilities and helpers
│   ├── types.ts              # TypeScript definitions
│   ├── constants.ts          # Constant values
│   ├── index.ts              # Utility exports
│   └── README.md             # Documentation for utilities
│
└── hooks/                    # Shared global hooks
    ├── index.ts              # Hook exports
    ├── useCamera.ts          # Camera management hook
    ├── useSceneContext.tsx   # Shared visual state context
    ├── useConfigContext.tsx  # Configuration context
    ├── useEnvironmentContext.tsx # Environment state context
    ├── useViewport.ts        # Viewport utilities
    ├── useLoading.ts         # Loading state tracking
    └── README.md             # Documentation for hooks
```

## Architecture Overview

The Three.js experience is built with a context-based architecture:

1. **Context Hierarchy**:

   - `ConfigContext`: Application-wide configuration and theming
   - `EnvironmentContext`: Environment-specific state
   - `SceneContext`: Shared visual state across components

2. **Component Organization**:

   - **Experiences**: Self-contained 3D experiences with their own components, hooks, and utilities
   - **Shared**: Reusable components shared across experiences
   - **Effects**: Visual enhancements like particles

3. **Resource Management**:
   - Centralized loading state
   - Consistent loading UI across the application
   - Clear component hierarchy

## Best Practices

1. **Memory Management**: Always clean up Three.js resources (geometries, materials, textures)
2. **Performance**: Use instancing for repeated elements, and optimize render loops
3. **Modularity**: Keep components focused on a single responsibility
4. **Context Usage**: Use contexts for shared state, but keep physics references local
5. **Loading States**: Track and manage loading states for all resources
6. **Client Components**: Add 'use client' only to root components, not to children or hooks

## Adding New Experiences

When adding new Three.js experiences:

1. Create a new directory in `experiences/` for the experience
2. Organize with internal subdirectories for components, hooks, and utils
3. Use the shared context system for global state
4. Create experience-specific hooks for local state and behavior
5. Document the experience structure in the README
