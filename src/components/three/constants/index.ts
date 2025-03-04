// ===== VIEWPORT CONSTANTS =====
export const MOBILE_BREAKPOINT = 768;
export const RESIZE_DELAY = 500;

// Card location offset from the center of the viewport
export const MOBILE_OFFSET = 0; 
export const DESKTOP_OFFSET = 0.25; 

// ===== PHYSICS CONSTANTS =====
// TetheredCard physics constants
export const ROPE_SEGMENT_LENGTH = 0.15;

export const SEGMENT_PROPS = {
  type: "dynamic" as const,
  canSleep: true,
  angularDamping: 2,
  linearDamping: 2,
};

// ===== RENDERING CONSTANTS =====
// Add rendering constants here as needed

// ===== INTERACTION CONSTANTS =====
// Add interaction constants here as needed 