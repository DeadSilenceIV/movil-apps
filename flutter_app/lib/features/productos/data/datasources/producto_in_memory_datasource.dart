import '../../domain/entities/producto.dart';

/// Estado en memoria (RAM) de los productos. NO hay persistencia local:
/// al cerrar la app, estos datos se pierden (requisito del proyecto).
class ProductoInMemoryDataSource {
  final List<Producto> _items = [];
  int _nextLocalId = 100000; // ids para productos creados localmente

  bool get isEmpty => _items.isEmpty;

  List<Producto> getAll() => List.unmodifiable(_items);

  Producto? getById(int id) {
    for (final item in _items) {
      if (item.id == id) return item;
    }
    return null;
  }

  void setAll(List<Producto> items) {
    _items
      ..clear()
      ..addAll(items);
  }

  /// Agrega un producto. Si no trae id válido, asigna uno local.
  Producto add(Producto producto) {
    final created =
        producto.id > 0 ? producto : producto.copyWith(id: _nextLocalId++);
    _items.insert(0, created);
    return created;
  }

  Producto update(Producto producto) {
    final index = _items.indexWhere((e) => e.id == producto.id);
    if (index != -1) {
      _items[index] = producto;
    } else {
      _items.insert(0, producto);
    }
    return producto;
  }

  void remove(int id) => _items.removeWhere((e) => e.id == id);

  List<Producto> search(String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return getAll();
    return _items
        .where((e) =>
            e.title.toLowerCase().contains(q) ||
            e.category.toLowerCase().contains(q))
        .toList();
  }
}
