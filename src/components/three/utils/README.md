# Three.js Utilities Directory

This directory contains utility functions, constants, types, and shared resources for the Three.js experience.

## Files

### constants.ts

Contains all constant values used throughout the Three.js components:

- Physics parameters
- Visual settings
- Size and position values
- Color values
- Animation parameters

```tsx
import { CARD_MODEL_SCALE, ROPE_SEGMENT_LENGTH } from './constants'
```

### types.ts

Contains TypeScript type definitions for the Three.js components:

- Component props interfaces
- Context state interfaces
- Extended types for Three.js and Rapier objects

```tsx
import { TetheredCardProps, SceneContextState } from './types'
```

### materials.ts

Contains custom material hooks and utilities:

- Reflective material for the card
- Material utilities with proper cleanup

```tsx
const reflectiveMaterial = useReflectiveMaterial()
```

### LoadingManager.tsx

Provides a context and components for managing loading states:

- Loading progress tracking
- Resource registration and completion
- Loading UI

```tsx
import { LoadingProvider, useLoadingContext } from './LoadingManager'

// In component
const { isLoading, progress } = useLoadingContext()
```

## Best Practices

1. **Organization**: Keep related constants and types together.
2. **Naming**: Use clear, descriptive names for constants and types.
3. **Documentation**: Document complex types and utility functions.
4. **Memory Management**: Ensure proper cleanup for materials and resources.
5. **Reusability**: Create utilities that can be reused across components.

## Adding New Utilities

When adding new utilities:

1. Place them in the appropriate file based on their purpose
2. Export them from the `index.ts` file
3. Document their usage with examples
4. Ensure they follow the existing patterns and naming conventions
