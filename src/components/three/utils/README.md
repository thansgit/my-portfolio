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
import { ANIMATION_DURATION, DEFAULT_COLORS } from './constants'
```

### types.ts

Contains TypeScript type definitions for the Three.js components:

- Component props interfaces
- Context state interfaces
- Extended types for Three.js objects
- Utility types

```tsx
import { ThreeComponentProps, EnvironmentConfig } from './types'
```

### threeHelpers.ts

Contains helper functions for working with Three.js:

- Material creation and management
- Geometry utilities
- Animation helpers
- Math utilities

```tsx
import { createDefaultMaterial, disposeObject } from './threeHelpers'
```

## Best Practices

1. **Organization**: Keep related constants and types together
2. **Naming**: Use clear, descriptive names for constants and types
3. **Documentation**: Document complex types and utility functions
4. **Memory Management**: Include utilities for proper resource cleanup
5. **Reusability**: Create utilities that can be reused across components

## Adding New Utilities

When adding new utilities:

1. Place them in the appropriate file based on their purpose
2. Export them from the `index.ts` file
3. Document their usage with examples
4. Ensure they follow the existing patterns and naming conventions
5. Add proper TypeScript types for all parameters and return values
