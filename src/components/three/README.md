# Three.js Components

This directory contains all Three.js related components organized in a logical structure:

## Directory Structure

```
src/components/three/
├── index.ts                  # Main exports
│
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
│       ├── visuals.tsx       # Visual elements
│       └── Pinhead.tsx       # Pinhead element for the card
│
├── effects/                  # Visual effects
│   └── Particles.tsx         # Particle system
│
├── utils/                    # Utilities and helpers
│   ├── types.ts              # TypeScript definitions
│   └── constants.ts          # Constant values
│
└── hooks/                    # Custom R3F hooks
    ├── index.ts              # Hook exports
    ├── useCamera.ts          # Camera management hook
    ├── useControls.ts        # User interaction control hooks
    ├── useLoading.ts         # Loading state management
    ├── usePhysics.ts         # Physics implementation
    └── useViewport.ts        # Viewport utilities
```

This structure follows React Three Fiber best practices by organizing components based on their role in the 3D scene.
The components are separated into logical categories:

- Canvas components handle the setup and management of the 3D canvas
- Environment components manage lighting and scene atmosphere
- Objects contain interactive 3D elements
- Effects provide visual enhancements
- Utils offer helper functions and type definitions
- Hooks provide reusable functionality across components
