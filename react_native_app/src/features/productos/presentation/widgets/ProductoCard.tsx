import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

import { radius, spacing, typography, useAppTheme } from '../../../../core/theme';
import type { Producto } from '../../domain/entities/Producto';

interface Props {
  producto: Producto;
  onPress: () => void;
  onDelete: () => void;
}

/**
 * Tarjeta de producto para la lista (design system §4): Card con radio 16 y sombra
 * suave, thumbnail 56×56 (radio 12, con placeholder), título, categoría y precio
 * destacado, además de la acción de eliminar.
 */
export default function ProductoCard({ producto, onPress, onDelete }: Props) {
  const theme = useAppTheme();

  return (
    <Card mode="elevated" style={styles.card} onPress={onPress}>
      <Card.Content style={styles.row}>
        <Thumbnail url={producto.thumbnail} />

        <View style={styles.info}>
          <Text style={[typography.subtitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
            {producto.title}
          </Text>
          <Text
            style={[typography.caption, { color: theme.colors.onSurfaceMuted }]}
            numberOfLines={1}
          >
            {producto.category === '' ? 'Sin categoría' : producto.category}
          </Text>
        </View>

        <Text style={[typography.subtitle, { color: theme.colors.primary }]}>
          ${producto.price.toFixed(2)}
        </Text>
        <IconButton
          icon="delete-outline"
          size={20}
          iconColor={theme.colors.error}
          onPress={onDelete}
          style={styles.delete}
        />
      </Card.Content>
    </Card>
  );
}

function Thumbnail({ url }: { url: string }) {
  const theme = useAppTheme();
  const [failed, setFailed] = useState(false);

  const placeholder = (
    <View style={[styles.thumb, styles.placeholder, { backgroundColor: theme.colors.surfaceVariant }]}>
      <IconButton icon="package-variant" size={24} iconColor={theme.colors.onSurfaceMuted} />
    </View>
  );

  if (url === '' || failed) return placeholder;

  return (
    <Image
      source={{ uri: url }}
      style={[styles.thumb, { backgroundColor: theme.colors.surfaceVariant }]}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.control,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  delete: {
    margin: 0,
  },
});
