export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  round: 9999,
} as const;

export const COLORS = {
  background: {
    primary: "#F8F9FC",
    secondary: "#FFFFFF",
    tertiary: "#F1F3F9",
    quaternary: "#E8EBF4",
    gradient1: "#6366F1",
    gradient2: "#8B5CF6",
  },
  text: {
    primary: "#1A1D2E",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
    inverse: "#FFFFFF",
  },
  border: {
    primary: "#E5E7EB",
    secondary: "#D1D5DB",
  },
  brand: {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    light: "#EEF2FF",
    accent: "#EC4899",
  },
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  intensity: {
    faible: "#3B82F6",
    moyenne: "#F59E0B",
    élevée: "#EF4444",
  },
} as const;

export const FONT_WEIGHT = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  black: "900",
} as const;
