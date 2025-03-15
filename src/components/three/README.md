# Three.js Components

This directory contains all Three.js related components organized in a logical structure:

## Directory Structure

```
src/components/three/
├── index.ts                  # Main exports
├── ThreeCanvas.tsx           # Main canvas component with all providers
│
├── core/                     # Core rendering components
│   ├── CanvasProvider.tsx    # Canvas setup and context
│   ├── Renderer.tsx          # WebGL renderer configuration
│   ├── CameraManager.tsx     # Camera setup and management
│   ├── SceneManager.tsx      # Scene content orchestration
│   └── index.ts              # Core component exports
│
├── context/                  # Context providers
│   ├── ConfigContext.tsx     # Application configuration
│   ├── SceneContext.tsx      # Scene state management
│   ├── EnvironmentContext.tsx # Environment settings
│   ├── LoadingContext.tsx    # Loading state management
│   └── index.ts              # Context exports
│
├── viewport/                 # Viewport management
│   ├── ViewportManager.tsx   # Viewport and responsive layout
│   └── ThreeLoadingTracker.tsx # Loading state tracker
│
├── components/               # Shared components
│   ├── Environment.tsx       # Lighting and environment
│   ├── ModelWrapper.tsx      # Model loading wrapper
│   ├── Particles.tsx         # Particle system
│   ├── ShaderBackground.tsx  # Background effects
│   └── index.ts              # Component exports
│
├── experiences/              # Self-contained experiences
│   └── TetheredCard/         # Tethered Card experience
│       ├── index.tsx         # Main component
│       ├── components/       # Experience-specific components
│       ├── hooks/            # Experience-specific hooks
│       └── utils/            # Experience-specific utilities
│
├── hooks/                    # Shared global hooks
│   ├── index.ts              # Hook exports
│   ├── useViewport.tsx       # Viewport utilities
│   ├── useCamera.tsx         # Camera management
│   └── README.md             # Documentation for hooks
│
└── utils/                    # Utilities and helpers
    ├── types.ts              # TypeScript definitions
    ├── constants.ts          # Constant values
    ├── threeHelpers.ts       # Three.js utility functions
    ├── index.ts              # Utility exports
    └── README.md             # Documentation for utilities
```

## Architecture Overview

The Three.js experience is built with a provider pattern architecture:

1. **Provider Hierarchy**:

   ```tsx
   <ThreeLoadingTracker>
     {' '}
     // Tracks loading state
     <Canvas>
       {' '}
       // R3F Canvas component
       <RendererSettings /> // Renderer configuration
       <ConfigProvider>
         {' '}
         // Global configuration
         <EnvironmentProvider>
           {' '}
           // Lighting and environment
           <SceneProvider>
             {' '}
             // Scene state management
             <ViewportProvider>
               {' '}
               // Viewport management
               <CameraManager>
                 {' '}
                 // Camera control
                 <SceneManager /> // Content orchestration
               </CameraManager>
             </ViewportProvider>
           </SceneProvider>
         </EnvironmentProvider>
       </ConfigProvider>
     </Canvas>
   </ThreeLoadingTracker>
   ```

2. **Component Organization**:

   - **Core**: Fundamental rendering components
   - **Context**: State management providers
   - **Viewport**: Viewport and loading management
   - **Components**: Shared visual components
   - **Experiences**: Self-contained 3D experiences
   - **Hooks**: Reusable behavior and state management
   - **Utils**: Helper functions and constants

3. **State Management**:
   - Context-based state sharing
   - Centralized loading state
   - Viewport-responsive layout

## Best Practices

1. **Memory Management**: Always clean up Three.js resources (geometries, materials, textures)
2. **Performance**:
   - Use instancing for repeated elements
   - Optimize render loops
   - Hide elements during loading
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
