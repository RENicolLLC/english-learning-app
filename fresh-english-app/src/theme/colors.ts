export const colors = {
  primary: {
    main: '#4A90E2',
    light: '#6AA9E9',
    dark: '#357ABD',
  },
  secondary: {
    main: '#FF6B6B',
    light: '#FF8E8E',
    dark: '#E65252',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F7FA',
    dark: '#1A1A1A',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#FFFFFF',
    muted: '#999999',
  },
  border: {
    light: '#E1E1E1',
    main: '#CCCCCC',
    dark: '#999999',
  },
  gradient: {
    start: '#4A90E2',
    end: '#357ABD',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const; 