// Tokens del design system compartido (docs/design-system.md).
// Única fuente de verdad del diseño en la app React Native; los mismos hex,
// escala tipográfica, espaciado y radios que usa la app Flutter (semilla #4F46E5).

/** Color semilla del design system. */
export const SEED = '#4F46E5';

/** Paleta por modo (design system §1). */
export const palette = {
  light: {
    primary: '#4F46E5',
    onPrimary: '#FFFFFF',
    secondary: '#06B6D4',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    onSurface: '#0F172A',
    onSurfaceMuted: '#64748B',
    error: '#EF4444',
    success: '#22C55E',
    outline: '#E2E8F0',
  },
  dark: {
    primary: '#818CF8',
    onPrimary: '#1E1B4B',
    secondary: '#22D3EE',
    background: '#0F172A',
    surface: '#1E293B',
    onSurface: '#E2E8F0',
    onSurfaceMuted: '#94A3B8',
    error: '#F87171',
    success: '#4ADE80',
    outline: '#334155',
  },
} as const;

/** Escala de espaciado en px (design system §3). Padding base de pantalla: 16. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screen: 16,
} as const;

/** Radios (design system §3). */
export const radius = {
  card: 16,
  control: 12, // inputs y botones
  pill: 999, // chips
} as const;

/** Sombra suave para tarjetas (design system §3). */
export const elevationShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.12,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  elevation: 2,
} as const;

/** Escala tipográfica compartida (design system §2). */
export const typography = {
  display: { fontSize: 28, fontWeight: '700' },
  headline: { fontSize: 24, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '600' },
  subtitle: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
} as const;

export type ColorTokens = Record<keyof (typeof palette)['light'], string>;
