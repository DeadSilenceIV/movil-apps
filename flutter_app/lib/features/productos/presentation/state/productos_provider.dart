import 'package:flutter/foundation.dart';

import '../../../../core/error/failures.dart';
import '../../domain/entities/producto.dart';
import '../../domain/usecases/create_producto.dart';
import '../../domain/usecases/delete_producto.dart';
import '../../domain/usecases/get_productos.dart';
import '../../domain/usecases/update_producto.dart';

enum ProductosStatus { initial, loading, loaded, error }

/// Gestor de estado formal (Provider / ChangeNotifier). Mantiene la lista de
/// productos en memoria durante toda la sesión y notifica a la UI ante cambios.
/// Invoca casos de uso, nunca el repositorio o HTTP directamente.
class ProductosProvider extends ChangeNotifier {
  final GetProductos getProductos;
  final CreateProducto createProducto;
  final UpdateProducto updateProducto;
  final DeleteProducto deleteProducto;

  ProductosProvider({
    required this.getProductos,
    required this.createProducto,
    required this.updateProducto,
    required this.deleteProducto,
  });

  ProductosStatus _status = ProductosStatus.initial;
  List<Producto> _productos = [];
  String _error = '';
  String _query = '';

  ProductosStatus get status => _status;
  String get error => _error;
  String get query => _query;

  /// Lista visible (aplica el filtro de búsqueda sobre el estado en memoria).
  List<Producto> get productos {
    if (_query.trim().isEmpty) return List.unmodifiable(_productos);
    final q = _query.toLowerCase();
    return _productos
        .where((p) =>
            p.title.toLowerCase().contains(q) ||
            p.category.toLowerCase().contains(q))
        .toList();
  }

  Producto? byId(int id) {
    for (final p in _productos) {
      if (p.id == id) return p;
    }
    return null;
  }

  Future<void> load({bool refresh = false}) async {
    _status = ProductosStatus.loading;
    notifyListeners();
    try {
      _productos = await getProductos(refresh);
      _status = ProductosStatus.loaded;
    } on Failure catch (f) {
      _error = f.message;
      _status = ProductosStatus.error;
    }
    notifyListeners();
  }

  void search(String value) {
    _query = value;
    notifyListeners();
  }

  Future<bool> create(Producto producto) async {
    try {
      await createProducto(producto);
      _productos = await getProductos(false);
      _status = ProductosStatus.loaded;
      notifyListeners();
      return true;
    } on Failure catch (f) {
      _error = f.message;
      notifyListeners();
      return false;
    }
  }

  Future<bool> edit(Producto producto) async {
    try {
      await updateProducto(producto);
      _productos = await getProductos(false);
      notifyListeners();
      return true;
    } on Failure catch (f) {
      _error = f.message;
      notifyListeners();
      return false;
    }
  }

  Future<bool> remove(int id) async {
    try {
      await deleteProducto(id);
      _productos = await getProductos(false);
      notifyListeners();
      return true;
    } on Failure catch (f) {
      _error = f.message;
      notifyListeners();
      return false;
    }
  }
}
