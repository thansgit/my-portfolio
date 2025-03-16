# Three.js Utilities Directory

This directory contains utility functions, constants, types, and shared resources for the Three.js experience. These
utilities form a crucial foundation for the exemplary Three.js architecture.

## Files

### constants.ts

Contains all constant values used throughout the Three.js components:

- Physics parameters (friction, restitution, etc.)
- Visual settings (intensity, range, colors)
- Size and position values for consistent layouts
- Color palettes and themes
- Animation parameters (duration, easing)

```tsx
import { ANIMATION_DURATION, DEFAULT_COLORS } from './constants'
```

### types.ts

Contains TypeScript type definitions for the Three.js components:

- Component props interfaces
- Context state interfaces with proper typing
- Extended types for Three.js objects
- Utility types for common patterns
- Shared type definitions for consistent data handling

```tsx
import { ThreeComponentProps, EnvironmentConfig } from './types'
```

### threeHelpers.ts

Contains helper functions for working with Three.js:

- Material creation and management
- Geometry utilities and optimizations
- Animation helpers and interpolation functions
- Math utilities (vectors, quaternions, etc.)
- Resource disposal and memory management
- Position and rotation utilities

```tsx
import { createDefaultMaterial, disposeObject } from './threeHelpers'
```

## Best Practices

1. **Organization**:

   - Keep related constants and types together
   - Group functions by related functionality
   - Maintain clear separation of concerns

2. **Naming**:

   - Use clear, descriptive names for constants and types
   - Follow consistent naming conventions
   - Use prefixes for related constants (e.g., `CAMERA_`, `MATERIAL_`)

3. **Documentation**:

   - Document complex types and utility functions
   - Include usage examples for non-obvious functions
   - Explain parameters and return values

4. **Memory Management**:

   - Include utilities for proper resource cleanup
   - Implement dispose patterns for Three.js objects
   - Prevent memory leaks with proper cleanup functions

5. **Reusability**:

   - Create utilities that can be reused across components
   - Design functions with clear inputs and outputs
   - Avoid side effects in utility functions

6. **Type Safety**:
   - Use strict TypeScript typing
   - Provide generics where appropriate
   - Define union and intersection types for complex cases

## Adding New Utilities

When adding new utilities:

1. Place them in the appropriate file based on their purpose
2. Export them from the `index.ts` file for easy importing
3. Document their usage with examples and parameter descriptions
4. Ensure they follow the existing patterns and naming conventions
5. Add proper TypeScript types for all parameters and return values

This utilities directory serves as the foundation for the scalable and maintainable Three.js architecture of the
project, providing consistent patterns and helper functions that make the rest of the codebase more concise and
reliable.
