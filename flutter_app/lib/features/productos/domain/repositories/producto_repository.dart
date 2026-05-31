import '../entities/producto.dart';

/// Contrato del repositorio (capa `domain`). La capa `data` lo implementa
/// coordinando el datasource remoto (API) y el de memoria (RAM).
abstract interface class ProductoRepository {
  Future<List<Producto>> getProductos({bool forceRefresh = false});
  Future<Producto> getProducto(int id);
  Future<List<Producto>> searchProductos(String query);
  Future<Producto> createProducto(Producto producto);
  Future<Producto> updateProducto(Producto producto);
  Future<void> deleteProducto(int id);
}
