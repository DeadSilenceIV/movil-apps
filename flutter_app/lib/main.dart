import 'package:flutter/material.dart';

import 'core/theme/app_theme.dart';

void main() {
  runApp(const ProductosApp());
}

class ProductosApp extends StatelessWidget {
  const ProductosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Productos',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
      home: const _HomePlaceholder(),
    );
  }
}

/// Pantalla inicial temporal (card 04). Se reemplaza por la navegación real
/// y la lista de productos en las cards 07 y 08.
class _HomePlaceholder extends StatelessWidget {
  const _HomePlaceholder();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Productos')),
      body: const Center(
        child: Text('Proyecto Flutter inicializado'),
      ),
    );
  }
}
