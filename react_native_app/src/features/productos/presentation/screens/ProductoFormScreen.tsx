import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { spacing, useAppTheme } from '../../../../core/theme';
import type { RootStackParamList } from '../../../../navigation/AppNavigator';
import { Producto } from '../../domain/entities/Producto';
import { useProductosStore } from '../state/productosStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductoForm'>;

/**
 * Formulario de creación/edición. Si la ruta trae `id`, edita el producto resuelto
 * desde el estado en RAM (campos precargados); si no, crea uno nuevo. Valida título
 * (requerido) y precio (> 0), guarda vía el store y regresa a la pantalla anterior.
 */
export default function ProductoFormScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const id = route.params?.id;

  const existing = useProductosStore((s) => (id != null ? s.items.find((p) => p.id === id) : undefined));
  const create = useProductosStore((s) => s.create);
  const edit = useProductosStore((s) => s.edit);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [stock, setStock] = useState(existing ? String(existing.stock) : '');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const priceNum = Number(price);
  const titleError = title.trim() === '';
  const priceError = !(priceNum > 0);

  const onSave = async () => {
    setSubmitted(true);
    if (titleError || priceError) return;

    setSaving(true);
    const changes = {
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      category: category.trim(),
      stock: Number(stock) || 0,
    };
    // En edición se parte del producto existente para no perder campos que el
    // formulario no edita (thumbnail, rating); en creación es uno nuevo (id 0).
    const data = existing
      ? existing.copyWith(changes)
      : new Producto({ id: 0, ...changes });
    const ok = existing ? await edit(data) : await create(data);
    setSaving(false);
    if (ok) navigation.goBack();
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        mode="outlined"
        label="Título"
        value={title}
        onChangeText={setTitle}
        error={submitted && titleError}
      />
      <HelperText type="error" visible={submitted && titleError}>
        El título es obligatorio.
      </HelperText>

      <TextInput
        mode="outlined"
        label="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        left={<TextInput.Affix text="$" />}
        error={submitted && priceError}
      />
      <HelperText type="error" visible={submitted && priceError}>
        Ingresa un precio mayor a 0.
      </HelperText>

      <TextInput
        mode="outlined"
        label="Categoría"
        value={category}
        onChangeText={setCategory}
        style={styles.field}
      />
      <TextInput
        mode="outlined"
        label="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="number-pad"
        style={styles.field}
      />
      <TextInput
        mode="outlined"
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.field}
      />

      <Button
        mode="contained"
        onPress={onSave}
        loading={saving}
        disabled={saving}
        style={styles.save}
      >
        {existing ? 'Guardar cambios' : 'Crear producto'}
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        disabled={saving}
        style={styles.cancel}
      >
        Cancelar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.screen,
  },
  field: {
    marginTop: spacing.sm,
  },
  save: {
    marginTop: spacing.xl,
  },
  cancel: {
    marginTop: spacing.sm,
  },
});
