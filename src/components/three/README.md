# Three.js Components

This directory contains all Three.js related components organized in an exemplary structure that follows best practices
for React Three Fiber projects.

## Directory Structuree

```
src/components/three/
├── index.ts                  # Main exports
├── ThreeCanvas.tsx           # Main canvas component with all providers
│
├── core/                     # Core rendering components
│   ├── CanvasWrapper.tsx     # Canvas setup and configuration
│   ├── Renderer.tsx          # WebGL renderer configuration
│   ├── CameraManager.tsx     # Camera setup and management
│   ├── TetheredCardManager.tsx # Manager for tethered card interaction
│   └── index.ts              # Core component exports
│
├── context/                  # Context providers
│   ├── ConfigContext.tsx     # Application configuration
│   ├── ViewportContext.tsx   # Viewport state management
│   ├── EnvironmentContext.tsx # Environment settings
│   ├── LoadingContext.tsx    # Loading state management
│   ├── TetheredCardContext.tsx # State for tethered card experience
│   └── index.ts              # Context exports
│
├── viewport/                 # Viewport management
│   ├── ViewportManager.tsx   # Viewport and responsive layout
│   └── LoadingTracker.tsx    # Loading state tracker
│
├── components/               # Shared components
│   ├── EnvironmentElements.tsx # Lighting and environment
│   ├── ModelWrapper.tsx      # Model loading wrapper
│   ├── ShaderBackground.tsx  # Background effects with custom shaders
│   └── index.ts              # Component exports
│
├── experiences/              # Self-contained experiences
│   └── TetheredCard/         # Tethered Card experience
│       ├── index.tsx         # Main component
│       ├── components/       # Experience-specific components
│       ├── hooks/            # Experience-specific hooks
│       └── utils/            # Experience-specific utilities
│
└── utils/                    # Utilities and helpers
    ├── types.ts              # TypeScript definitions
    ├── constants.ts          # Constant values
    ├── threeHelpers.ts       # Three.js utility functions
    ├── index.ts              # Utility exports
    └── README.md             # Documentation for utilities
```

## Architecture Overview

The Three.js experience is built with a provider pattern architecture that demonstrates excellent separation of
concerns:

1. **Provider Hierarchy**:

   ```tsx
   <ThreeCanvas>
     <LoadingTracker>
       {' '}
       {/* Tracks loading state */}
       <Canvas>
         {' '}
         {/* R3F Canvas component */}
         <Renderer /> {/* Renderer configuration */}
         <ConfigProvider>
           {' '}
           {/* Global configuration */}
           <EnvironmentProvider>
             {' '}
             {/* Lighting and environment */}
             <ViewportProvider>
               {' '}
               {/* Viewport management */}
               <CameraManager>
                 {' '}
                 {/* Camera control */}
                 <TetheredCardManager /> {/* Experience management */}
                 {/* Other experiences as needed */}
               </CameraManager>
             </ViewportProvider>
           </EnvironmentProvider>
         </ConfigProvider>
       </Canvas>
     </LoadingTracker>
   </ThreeCanvas>
   ```

2. **Component Organization**:

   - **Core**: Fundamental rendering components that handle the technical aspects
   - **Context**: State management providers with clear separation of responsibilities
   - **Viewport**: Responsive viewport and loading management
   - **Components**: Shared visual components that can be reused across experiences
   - **Experiences**: Self-contained 3D modules, each with its own components, hooks, and utilities
   - **Utils**: Helper functions, type definitions, and constants

3. **State Management**:
   - Context-based state sharing for clean, predictable data flow
   - Centralized loading state for consistent user experience
   - Viewport-responsive layout for multi-device compatibility

## Best Practices

1. **Memory Management**:

   - Proper cleanup of Three.js resources (geometries, materials, textures)
   - Dispose patterns in component unmount phases

2. **Performance**:

   - Instancing for repeated elements
   - Optimized render loops with useFrame
   - Visibility control during loading
   - Proper use of useMemo and useCallback for Three.js objects

3. **Modularity**:

   - Components focused on single responsibilities
   - Clear boundaries between different parts of the system

4. **Context Usage**:

   - Contexts for shared state
   - Local state for component-specific behavior
   - Physics references kept local to avoid unnecessary re-renders

5. **Loading States**:

   - Centralized tracking of loading progress
   - Graceful handling of async resources

6. **Client Components**:
   - 'use client' directives only at root level
   - Server-compatible code where possible

## Adding New Experiences

When adding new Three.js experiences:

1. Create a new directory in `experiences/` following the TetheredCard pattern
2. Organize with internal subdirectories for components, hooks, and utils
3. Leverage the shared context system for global state
4. Create experience-specific hooks for local state and behavior
5. Document the experience structure in a README
6. Export the experience through the main index.ts file

This architecture is designed to scale with additional 3D experiences while maintaining code quality and performance.
