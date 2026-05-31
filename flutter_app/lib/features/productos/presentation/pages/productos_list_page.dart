import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../state/productos_provider.dart';

/// Pantalla principal: lista de productos. La UI completa (tarjetas, estados,
/// pull-to-refresh) se desarrolla en la card 08; aquí queda la navegación.
class ProductosListPage extends StatelessWidget {
  const ProductosListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProductosProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('Productos')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/form'),
        child: const Icon(Icons.add),
      ),
      body: ListView.builder(
        itemCount: provider.productos.length,
        itemBuilder: (context, index) {
          final producto = provider.productos[index];
          return ListTile(
            title: Text(producto.title),
            subtitle: Text(producto.category),
            onTap: () => context.push('/detail/${producto.id}'),
          );
        },
      ),
    );
  }
}
