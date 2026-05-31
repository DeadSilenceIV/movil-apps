import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { palette, radius, spacing, type ColorTokens } from './tokens';

/** Colores extra del design system que MD3 no expone por defecto. */
type CustomColors = {
  success: string;
  onSurfaceMuted: string;
};

/** Tema de Paper con los tokens del design system añadidos. */
export type AppTheme = MD3Theme & {
  colors: MD3Theme['colors'] & CustomColors;
  spacing: typeof spacing;
  radius: typeof radius;
};

function build(base: MD3Theme, c: ColorTokens): AppTheme {
  return {
    ...base,
    // Radio base MD3 = 4; con multiplicador 1 => esquinas del design system
    // se aplican explícitamente en componentes (card 16, control 12).
    roundness: radius.control,
    colors: {
      ...base.colors,
      primary: c.primary,
      onPrimary: c.onPrimary,
      secondary: c.secondary,
      background: c.background,
      onBackground: c.onSurface,
      surface: c.surface,
      onSurface: c.onSurface,
      surfaceVariant: c.surface,
      onSurfaceVariant: c.onSurfaceMuted,
      error: c.error,
      outline: c.outline,
      outlineVariant: c.outline,
      elevation: {
        ...base.colors.elevation,
        level0: 'transparent',
        level1: c.surface,
        level2: c.surface,
      },
      success: c.success,
      onSurfaceMuted: c.onSurfaceMuted,
    },
    spacing,
    radius,
  };
}

export const lightTheme: AppTheme = build(MD3LightTheme, palette.light);
export const darkTheme: AppTheme = build(MD3DarkTheme, palette.dark);
