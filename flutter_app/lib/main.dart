import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/theme/app_theme.dart';
import 'features/productos/presentation/state/productos_provider.dart';
import 'injection_container.dart';

void main() {
  initDependencies();
  runApp(const ProductosApp());
}

class ProductosApp extends StatelessWidget {
  const ProductosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<ProductosProvider>(
      create: (_) => sl<ProductosProvider>()..load(),
      child: MaterialApp(
        title: 'Productos',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        themeMode: ThemeMode.system,
        home: const _HomePlaceholder(),
      ),
    );
  }
}

/// Home temporal (card 06): consume el estado en memoria y reacciona a sus
/// cambios. Se reemplaza por la navegación real (go_router) en la card 07.
class _HomePlaceholder extends StatelessWidget {
  const _HomePlaceholder();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Productos')),
      body: Center(
        child: Consumer<ProductosProvider>(
          builder: (context, provider, _) {
            return switch (provider.status) {
              ProductosStatus.loading ||
              ProductosStatus.initial =>
                const CircularProgressIndicator(),
              ProductosStatus.error => Text(provider.error),
              ProductosStatus.loaded =>
                Text('${provider.productos.length} productos en memoria'),
            };
          },
        ),
      ),
    );
  }
}
