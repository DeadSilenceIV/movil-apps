import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../state/productos_provider.dart';
import '../widgets/producto_card.dart';

/// Pantalla principal: lista dinámica de productos con búsqueda, pull-to-refresh
/// y estados de carga/vacío/error (design system §4 y §5).
class ProductosListPage extends StatelessWidget {
  const ProductosListPage({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProductosProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Productos'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(64),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: TextField(
              onChanged: provider.search,
              decoration: const InputDecoration(
                hintText: 'Buscar productos...',
                prefixIcon: Icon(Icons.search),
                isDense: true,
              ),
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/form'),
        child: const Icon(Icons.add),
      ),
      body: switch (provider.status) {
        ProductosStatus.initial ||
        ProductosStatus.loading =>
          const Center(child: CircularProgressIndicator()),
        ProductosStatus.error => _ErrorState(
            message: provider.error,
            onRetry: () => provider.load(refresh: true),
          ),
        ProductosStatus.loaded => _ProductosList(provider: provider),
      },
    );
  }
}

class _ProductosList extends StatelessWidget {
  final ProductosProvider provider;
  const _ProductosList({required this.provider});

  @override
  Widget build(BuildContext context) {
    final productos = provider.productos;

    if (productos.isEmpty) {
      return _EmptyState(searching: provider.query.trim().isNotEmpty);
    }

    return RefreshIndicator(
      onRefresh: () => provider.load(refresh: true),
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
        itemCount: productos.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final producto = productos[index];
          return ProductoCard(
            producto: producto,
            onTap: () => context.push('/detail/${producto.id}'),
            onConfirmDelete: () => _confirmDelete(context, producto.title),
            onDeleted: () async {
              final ok = await context.read<ProductosProvider>().remove(producto.id);
              if (context.mounted && ok) {
                _snack(context, 'Producto eliminado');
              }
            },
          );
        },
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final bool searching;
  const _EmptyState({required this.searching});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            searching ? Icons.search_off : Icons.inventory_2_outlined,
            size: 64,
            color: scheme.onSurfaceVariant,
          ),
          const SizedBox(height: 16),
          Text(
            searching ? 'Sin resultados' : 'No hay productos',
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ],
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const _ErrorState({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.cloud_off, size: 64, color: scheme.error),
            const SizedBox(height: 16),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton.tonalIcon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }
}

Future<bool> _confirmDelete(BuildContext context, String title) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Eliminar producto'),
      content: Text('¿Eliminar "$title"? Esta acción no se puede deshacer.'),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(context, true),
          child: const Text('Eliminar'),
        ),
      ],
    ),
  );
  return result ?? false;
}

void _snack(BuildContext context, String message) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(message)));
}
