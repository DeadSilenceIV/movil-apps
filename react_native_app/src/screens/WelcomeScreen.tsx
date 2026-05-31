import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Appbar, Button, Card, FAB, List, Text } from 'react-native-paper';

import { radius, spacing, typography, useAppTheme } from '../core/theme';
import {
  selectVisibleProductos,
  useProductosStore,
} from '../features/productos/presentation/state/productosStore';

/**
 * Pantalla inicial. Demuestra el tema del design system (card 10) y consume el
 * estado global en memoria (card 12) para mostrar reactividad: carga real desde
 * la API, estados de loading/error y la lista mantenida en RAM.
 */
export default function WelcomeScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const status = useProductosStore((s) => s.status);
  const error = useProductosStore((s) => s.error);
  const productos = useProductosStore(selectVisibleProductos);
  const load = useProductosStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="Productos" titleStyle={typography.title} />
        <Appbar.Action icon="refresh" onPress={() => load(true)} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: spacing.screen, gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.headline, { color: theme.colors.onSurface }]}>
            React Native + Expo
          </Text>
          <Text style={[typography.body, { color: theme.colors.onSurfaceMuted }]}>
            Proyecto base con el design system compartido. El tema sigue Material
            Design 3 y soporta modo claro y oscuro.
          </Text>
        </View>

        <Card style={styles.card} mode="elevated">
          <Card.Content style={{ gap: spacing.sm }}>
            <Text style={[typography.subtitle, { color: theme.colors.onSurface }]}>
              Estado global (RAM)
            </Text>

            {status === 'loading' && (
              <View style={styles.centerRow}>
                <ActivityIndicator />
                <Text style={[typography.body, { color: theme.colors.onSurfaceMuted }]}>
                  Cargando productos del API…
                </Text>
              </View>
            )}

            {status === 'error' && (
              <View style={{ gap: spacing.sm }}>
                <Text style={[typography.body, { color: theme.colors.error }]}>{error}</Text>
                <Button mode="outlined" onPress={() => load(true)}>
                  Reintentar
                </Button>
              </View>
            )}

            {status === 'loaded' && (
              <>
                <Text style={[typography.body, { color: theme.colors.onSurfaceMuted }]}>
                  {productos.length} productos en memoria durante la sesión.
                </Text>
                {productos.slice(0, 5).map((p) => (
                  <List.Item
                    key={p.id}
                    title={p.title}
                    description={p.category}
                    titleStyle={typography.subtitle}
                    right={() => (
                      <Text style={[typography.subtitle, { color: theme.colors.primary }]}>
                        ${p.price}
                      </Text>
                    )}
                  />
                ))}
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
  },
});
