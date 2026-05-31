import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Divider, IconButton, Text } from 'react-native-paper';

import { radius, spacing, typography, useAppTheme } from '../../../../core/theme';
import type { RootStackParamList } from '../../../../navigation/AppNavigator';
import { useProductosStore } from '../state/productosStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductoDetail'>;

/**
 * Detalle de un producto. El parámetro de ruta es el `id`; el producto se resuelve
 * desde el estado global en RAM (evita pasar instancias no serializables por la
 * navegación). Permite editar (formulario) o eliminar (vuelve a la lista).
 */
export default function ProductoDetailScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const { id } = route.params;

  const producto = useProductosStore((s) => s.items.find((p) => p.id === id));
  const remove = useProductosStore((s) => s.remove);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        producto ? (
          <IconButton
            icon="pencil"
            iconColor={theme.colors.onSurface}
            onPress={() => navigation.navigate('ProductoForm', { id })}
          />
        ) : null,
    });
  }, [navigation, producto, id, theme.colors.onSurface]);

  if (!producto) {
    return (
      <View style={styles.center}>
        <Text style={[typography.body, { color: theme.colors.onSurfaceMuted }]}>
          Producto no encontrado.
        </Text>
      </View>
    );
  }

  const onDelete = async () => {
    const ok = await remove(producto.id);
    if (ok) navigation.goBack();
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: spacing.screen, gap: spacing.lg }}
    >
      {producto.thumbnail !== '' && (
        <Image
          source={{ uri: producto.thumbnail }}
          style={[styles.image, { backgroundColor: theme.colors.surface }]}
          resizeMode="contain"
        />
      )}

      <View style={styles.titleRow}>
        <Text style={[typography.headline, { color: theme.colors.onSurface, flex: 1 }]}>
          {producto.title}
        </Text>
        <Text style={[typography.headline, { color: theme.colors.primary }]}>
          ${producto.price}
        </Text>
      </View>

      <View style={styles.chips}>
        {producto.category !== '' && <Chip icon="tag">{producto.category}</Chip>}
        <Chip icon="package-variant">Stock: {producto.stock}</Chip>
        <Chip icon="star">{producto.rating.toFixed(1)}</Chip>
      </View>

      {producto.description !== '' && (
        <>
          <Divider />
          <Text style={[typography.body, { color: theme.colors.onSurfaceMuted }]}>
            {producto.description}
          </Text>
        </>
      )}

      <Button
        mode="outlined"
        icon="delete"
        textColor={theme.colors.error}
        onPress={onDelete}
        style={{ marginTop: spacing.md }}
      >
        Eliminar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screen,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: radius.card,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
