import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  NavigationContainer,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

import { useAppTheme } from '../core/theme';
import ProductoDetailScreen from '../features/productos/presentation/screens/ProductoDetailScreen';
import ProductoFormScreen from '../features/productos/presentation/screens/ProductoFormScreen';
import ProductosListScreen from '../features/productos/presentation/screens/ProductosListScreen';

/** Rutas de la app y sus parámetros (navegación tipada). */
export type RootStackParamList = {
  ProductosList: undefined;
  ProductoDetail: { id: number };
  ProductoForm: { id?: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegación formal con React Navigation (native-stack): 3 pantallas (lista,
 * detalle y formulario de creación/edición) con transiciones nativas, gesto de
 * retorno y un header consistente estilizado según el design system.
 */
export default function AppNavigator() {
  const theme = useAppTheme();
  const scheme = useColorScheme();

  const navBase = scheme === 'dark' ? NavDarkTheme : NavLightTheme;
  const navTheme: NavTheme = {
    ...navBase,
    colors: {
      ...navBase.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: { fontWeight: '600', fontSize: 20 },
          headerShadowVisible: true,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="ProductosList"
          component={ProductosListScreen}
          options={{ title: 'Productos' }}
        />
        <Stack.Screen
          name="ProductoDetail"
          component={ProductoDetailScreen}
          options={{ title: 'Detalle' }}
        />
        <Stack.Screen
          name="ProductoForm"
          component={ProductoFormScreen}
          options={{ title: 'Producto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
