// Animation variants for consistent motion across components
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

// 3D lighting configurations
export const LIGHTING_CONFIG = {
  ambient: {
    intensity: 0.6,
  },
  directional: {
    position: [10, 10, 5] as [number, number, number],
    intensity: 0.8,
  },
  pointLights: {
    primary: {
      position: [-10, -10, -5] as [number, number, number],
      intensity: 0.5,
      color: "#3b82f6",
    },
    secondary: {
      position: [10, -10, 5] as [number, number, number],
      intensity: 0.3,
      color: "#8b5cf6",
    },
  },
};

// Theme colors for consistency
export const THEME_COLORS = {
  gradients: {
    primary: "from-cyan-600 to-blue-600",
    secondary: "from-blue-600 to-purple-600",
    accent: "from-purple-500 to-pink-500",
  },
  backgrounds: {
    card: "bg-black/50 backdrop-blur-xl border border-white/20",
    section: "bg-black/70 backdrop-blur-sm",
  },
  text: {
    primary: "text-white",
    secondary: "text-gray-300",
    muted: "text-gray-400",
  },
};

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Animation timing constants
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.8,
} as const;