import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, Divider, FAB, List, Text } from 'react-native-paper';

import { radius, spacing, typography, useAppTheme } from '../../../../core/theme';
import type { RootStackParamList } from '../../../../navigation/AppNavigator';
import { selectVisibleProductos, useProductosStore } from '../state/productosStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductosList'>;

/**
 * Pantalla principal (lista). Consume el estado global en RAM y navega al detalle
 * de un producto o al formulario de creación. La obtención de datos ocurre una vez
 * al montar; los estados de carga/error se reflejan desde el store.
 */
export default function ProductosListScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const status = useProductosStore((s) => s.status);
  const error = useProductosStore((s) => s.error);
  const productos = useProductosStore(selectVisibleProductos);
  const load = useProductosStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading' && productos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={[typography.body, { color: theme.colors.onSurfaceMuted }]}>
          Cargando productos…
        </Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={[typography.body, { color: theme.colors.error, textAlign: 'center' }]}>
          {error}
        </Text>
        <Button mode="contained" onPress={() => load(true)}>
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={productos}
        keyExtractor={(p) => String(p.id)}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl * 2 }}
        refreshing={status === 'loading'}
        onRefresh={() => load(true)}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.category}
            titleStyle={typography.subtitle}
            descriptionStyle={[typography.caption, { color: theme.colors.onSurfaceMuted }]}
            onPress={() => navigation.navigate('ProductoDetail', { id: item.id })}
            right={() => (
              <Text style={[typography.subtitle, { color: theme.colors.primary }]}>
                ${item.price}
              </Text>
            )}
          />
        )}
      />

      <FAB
        icon="plus"
        label="Nuevo"
        style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
        onPress={() => navigation.navigate('ProductoForm', {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.screen,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    borderRadius: radius.pill,
  },
});
