// ===== VIEWPORT CONSTANTS =====
export const MOBILE_BREAKPOINT = 768
export const RESIZE_DELAY = 500

// Card location offset from the center of the viewport
export const MOBILE_OFFSET = 0
export const DESKTOP_OFFSET = 0.25

// ===== PHYSICS CONSTANTS =====
// TetheredCard physics constants
export const ROPE_INITIAL_RADIUS = 0.04
export const ROPE_SEGMENT_LENGTH = 0.13
export const ROPE_MIN_RADIUS = ROPE_INITIAL_RADIUS * 0.3 //30% of the original radius
//Smaller number = faster stretch
export const ROPE_COLOR_STRETCH_SPEED = 10
//Smaller number = faster stretch
export const ROPE_RADIUS_STRETCH_SPEED = 5

export const SEGMENT_PROPS = {
  type: 'dynamic' as const,
  canSleep: true,
  angularDamping: 2,
  linearDamping: 2,
}

// ===== CARD CONSTANTS =====
export const CARD_DEFAULT_MAX_SPEED = 50
export const CARD_DEFAULT_MIN_SPEED = 10
export const CARD_MODEL_SCALE = 2
export const CARD_POSITION_OFFSET = [0, 0.3, 0] as [number, number, number]
export const CARD_SWING_AMPLITUDE = 0.4
export const CARD_SWING_FREQUENCY = 0.4
export const CARD_ROTATION_DAMPING = 0.9

// ===== PINHEAD CONSTANTS =====
export const PINHEAD_OFFSET = 0.18
export const PINHEAD_SIZE = 0.08
export const PINHEAD_COLOR = 'red'
export const PINHEAD_GLOW_TIMEOUT = 1500 // ms

// ===== INTERACTION CONSTANTS =====
export const DRAGGABLE_PLANE_SIZE = 2.5
export const BALL_COLLIDER_SIZES = {
  JOINT_2: 0.1,
  JOINT_3: 0.05,
  JOINT_4: 0.05,
}

// ===== PARTICLE CONSTANTS =====
export const PARTICLE_SIZE = 0.075
export const PARTICLE_COUNT = 200

// ===== RENDERING CONSTANTS =====
// Background mesh constants
export const BACKGROUND_MESH_POSITION = [0, 0, -20] as [number, number, number]
export const BACKGROUND_MESH_SIZE = [100, 100] as [number, number]
export const BACKGROUND_COLOR = '#252730'

// ===== MATERIAL CONSTANTS =====
// Card material constants (non-glass)
export const CARD_MATERIAL = {
  roughness: 0.3, // Slightly rougher for better visibility
  metalness: 0.7, // Slightly less metallic
  envMapIntensity: 1.5, // More environment reflection
  reflectivity: 1,
  clearcoat: 1,
  clearcoatRoughness: 0.2,
}
