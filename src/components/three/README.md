# Three.js Components

This directory contains all Three.js related components organized in a logical structure:

## Directory Structure

```
src/components/three/
├── canvas/                   # Core canvas setup
│   ├── Scene.tsx             # Main Canvas component
│   ├── LoadingProvider.tsx   # Loading state provider
│   └── ViewportManager.tsx   # Viewport and responsive layout management
│
├── environment/              # Scene environment
│   └── Environment.tsx       # Lighting, background, and atmosphere
│
├── objects/                  # Interactive 3D objects
│   └── TetheredCard/         # Card component group
│       ├── index.tsx         # Main component
│       ├── physics.tsx       # Physics implementation
│       ├── visuals.tsx       # Visual elements
│       └── controls.tsx      # User interaction controls
│
├── effects/                  # Visual effects
│   └── Particles.tsx         # Particle system
│
├── elements/                 # Simpler scene elements
│   └── Pinhead.tsx           # Pinhead element
│
├── utils/                    # Utilities and helpers
│   ├── types.ts              # TypeScript definitions
│   ├── constants.ts          # Constant values
│   └── r3fUtils.ts           # Helper functions
│
└── hooks/                    # Custom R3F hooks
    └── useThree.ts           # Three.js utility hooks
```

## Refactoring Plan

1. Move files to their new locations
2. Update imports in all files
3. Rename files as needed (e.g., Background.tsx → Environment.tsx)
4. Consolidate related functionality (e.g., TetheredCardInteractions.tsx and TetheredCardRotationTracker.tsx → controls.tsx)

This structure follows React Three Fiber best practices by organizing components based on their role in the 3D scene. 