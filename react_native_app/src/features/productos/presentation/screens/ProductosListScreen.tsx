import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, FAB, Icon, Searchbar, Text } from 'react-native-paper';

import { radius, spacing, typography, useAppTheme } from '../../../../core/theme';
import type { RootStackParamList } from '../../../../navigation/AppNavigator';
import type { Producto } from '../../domain/entities/Producto';
import { filterProductos, useProductosStore } from '../state/productosStore';
import ProductoCard from '../widgets/ProductoCard';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductosList'>;

/**
 * Pantalla principal (card 14): lista dinámica de tarjetas con búsqueda,
 * pull-to-refresh y estados de carga/vacío/error. Todo el CRUD se refleja sobre
 * el estado en memoria sin recargar del API.
 */
export default function ProductosListScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const status = useProductosStore((s) => s.status);
  const error = useProductosStore((s) => s.error);
  const query = useProductosStore((s) => s.query);
  const items = useProductosStore((s) => s.items);
  const load = useProductosStore((s) => s.load);
  const search = useProductosStore((s) => s.search);
  const remove = useProductosStore((s) => s.remove);

  const productos = useMemo(() => filterProductos(items, query), [items, query]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = (producto: Producto) => {
    Alert.alert(
      'Eliminar producto',
      `¿Eliminar "${producto.title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => remove(producto.id) },
      ],
    );
  };

  const isLoading = status === 'loading';

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.searchWrap}>
        <Searchbar
          placeholder="Buscar productos..."
          value={query}
          onChangeText={search}
          elevation={1}
        />
      </View>

      {isLoading && productos.length === 0 ? (
        <CenteredState>
          <ActivityIndicator />
          <Text style={[typography.body, { color: theme.colors.onSurfaceMuted }]}>
            Cargando productos…
          </Text>
        </CenteredState>
      ) : status === 'error' ? (
        <CenteredState>
          <Icon source="cloud-off-outline" size={64} color={theme.colors.error} />
          <Text style={[typography.body, { color: theme.colors.onSurface, textAlign: 'center' }]}>
            {error}
          </Text>
          <Button mode="contained-tonal" icon="refresh" onPress={() => load(true)}>
            Reintentar
          </Button>
        </CenteredState>
      ) : productos.length === 0 ? (
        <CenteredState>
          <Icon
            source={query.trim() === '' ? 'package-variant' : 'magnify-close'}
            size={64}
            color={theme.colors.onSurfaceMuted}
          />
          <Text style={[typography.subtitle, { color: theme.colors.onSurfaceMuted }]}>
            {query.trim() === '' ? 'No hay productos' : 'Sin resultados'}
          </Text>
        </CenteredState>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{
            padding: spacing.screen,
            paddingBottom: insets.bottom + spacing.xxl * 2,
            gap: spacing.md,
          }}
          refreshing={isLoading}
          onRefresh={() => load(true)}
          renderItem={({ item }) => (
            <ProductoCard
              producto={item}
              onPress={() => navigation.navigate('ProductoDetail', { id: item.id })}
              onDelete={() => confirmDelete(item)}
            />
          )}
        />
      )}

      <FAB
        icon="plus"
        label="Nuevo"
        style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
        onPress={() => navigation.navigate('ProductoForm', {})}
      />
    </View>
  );
}

function CenteredState({ children }: { children: React.ReactNode }) {
  return <View style={styles.center}>{children}</View>;
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
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
