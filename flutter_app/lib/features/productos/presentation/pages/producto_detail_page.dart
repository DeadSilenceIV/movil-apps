import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../state/productos_provider.dart';

/// Pantalla de detalle de un producto. La UI rica (imagen, confirmación de
/// borrado, feedback) se completa en la card 08.
class ProductoDetailPage extends StatelessWidget {
  final int id;
  const ProductoDetailPage({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProductosProvider>();
    final producto = provider.byId(id);

    if (producto == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: Text('Producto no encontrado')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(producto.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            onPressed: () => context.push('/form', extra: producto),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () async {
              await context.read<ProductosProvider>().remove(producto.id);
              if (context.mounted) context.pop();
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(producto.category),
            const SizedBox(height: 8),
            Text('\$${producto.price.toStringAsFixed(2)}'),
            const SizedBox(height: 8),
            Text('Stock: ${producto.stock}'),
            const SizedBox(height: 16),
            Text(producto.description),
          ],
        ),
      ),
    );
  }
}
