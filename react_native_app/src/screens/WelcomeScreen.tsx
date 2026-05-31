import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Appbar, Button, Card, FAB, Text } from 'react-native-paper';

import { radius, spacing, typography, useAppTheme } from '../core/theme';

/**
 * Pantalla inicial del scaffolding (card 10). Solo verifica que el tema del
 * design system está activo; las pantallas de productos llegan en cards posteriores.
 */
export default function WelcomeScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="Productos" titleStyle={typography.title} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{ padding: spacing.screen, gap: spacing.lg }}
      >
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
              Tema centralizado
            </Text>
            <Text style={[typography.body, { color: theme.colors.onSurfaceMuted }]}>
              Semilla #4F46E5 · tokens en core/theme · idéntico a la app Flutter.
            </Text>
            <View style={styles.swatches}>
              <Swatch color={theme.colors.primary} label="primary" />
              <Swatch color={theme.colors.secondary} label="secondary" />
              <Swatch color={theme.colors.success} label="success" />
              <Swatch color={theme.colors.error} label="error" />
            </View>
          </Card.Content>
        </Card>

        <View style={{ gap: spacing.sm }}>
          <Button mode="contained" icon="rocket-launch" onPress={() => {}}>
            Botón primario
          </Button>
          <Button mode="outlined" onPress={() => {}}>
            Botón secundario
          </Button>
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + spacing.lg }]}
        onPress={() => {}}
      />
    </View>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  const theme = useAppTheme();
  return (
    <View style={{ alignItems: 'center', gap: spacing.xs }}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text style={[typography.caption, { color: theme.colors.onSurfaceMuted }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
  },
  swatches: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: radius.control,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
  },
});
