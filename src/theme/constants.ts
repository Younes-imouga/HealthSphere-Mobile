export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999,
} as const;

export const COLORS = {
  background: {
    primary: '#0A0B0E',
    secondary: '#111318',
    tertiary: '#1A1D24',
    quaternary: '#2A2D36',
  },
  text: {
    primary: '#F0F2F7',
    secondary: '#7A7F8E',
    tertiary: '#3D4150',
    inverse: '#0A0B0E',
  },
  border: {
    primary: '#222530',
    secondary: '#3D4150',
  },
  brand: {
    primary: '#00E5A0',
    secondary: '#00E5A020',
  },
  status: {
    success: '#00E5A0',
    warning: '#FFB800',
    error: '#FF6B35',
    info: '#4D9EFF',
  },
  intensity: {
    faible: '#4D9EFF',
    moyenne: '#FFB800',
    élevée: '#FF6B35',
  },
} as const;

export const FONT_WEIGHT = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
