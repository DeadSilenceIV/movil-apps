import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  PaperProvider,
  useTheme as usePaperTheme,
} from 'react-native-paper';

import { darkTheme, lightTheme, type AppTheme } from './paperTheme';

/** Hook tipado para acceder al tema (colores + spacing + radius) en componentes. */
export const useAppTheme = () => usePaperTheme<AppTheme>();

/**
 * Provider global del tema. Selecciona claro/oscuro según el sistema
 * (design system §1: soporte obligatorio de modo claro y oscuro).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </SafeAreaProvider>
  );
}
