import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/router/app_router.dart';
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
      child: MaterialApp.router(
        title: 'Productos',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        themeMode: ThemeMode.system,
        routerConfig: appRouter,
      ),
    );
  }
}
