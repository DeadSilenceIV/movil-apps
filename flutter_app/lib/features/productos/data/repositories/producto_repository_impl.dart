import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/producto.dart';
import '../../domain/repositories/producto_repository.dart';
import '../datasources/producto_in_memory_datasource.dart';
import '../datasources/producto_remote_datasource.dart';
import '../models/producto_model.dart';

/// Implementación del repositorio: coordina el datasource remoto (API REST) y
/// el de memoria (RAM). El estado canónico vive en memoria; las escrituras se
/// envían a la API (que las simula) y siempre se reflejan en memoria.
class ProductoRepositoryImpl implements ProductoRepository {
  final ProductoRemoteDataSource remote;
  final ProductoInMemoryDataSource memory;

  ProductoRepositoryImpl({required this.remote, required this.memory});

  @override
  Future<List<Producto>> getProductos({bool forceRefresh = false}) async {
    if (memory.isEmpty || forceRefresh) {
      try {
        final remoteItems = await remote.getProductos();
        memory.setAll(remoteItems);
      } on ServerException catch (e) {
        throw ServerFailure(e.message);
      } on NetworkException {
        throw const NetworkFailure();
      }
    }
    return memory.getAll();
  }

  @override
  Future<Producto> getProducto(int id) async {
    final cached = memory.getById(id);
    if (cached != null) return cached;
    try {
      return await remote.getProducto(id);
    } on ServerException catch (e) {
      throw ServerFailure(e.message);
    } on NetworkException {
      throw const NetworkFailure();
    }
  }

  @override
  Future<List<Producto>> searchProductos(String query) async {
    if (memory.isEmpty) await getProductos();
    return memory.search(query);
  }

  @override
  Future<Producto> createProducto(Producto producto) async {
    // POST a la API (simulada). Si hay red, usamos el id que devuelve; si no,
    // el datasource de memoria asigna un id local. El producto siempre se crea.
    int? remoteId;
    try {
      final created = await remote.createProducto(ProductoModel.fromEntity(producto));
      remoteId = created.id;
    } on ServerException catch (e) {
      throw ServerFailure(e.message);
    } on NetworkException {
      remoteId = null; // sin conexión: se crea solo en memoria
    }
    final toStore =
        remoteId != null ? producto.copyWith(id: remoteId) : producto;
    return memory.add(toStore);
  }

  @override
  Future<Producto> updateProducto(Producto producto) async {
    // PUT a la API (mejor esfuerzo: la API solo conoce ids del servidor).
    await _bestEffortRemoteWrite(
        () => remote.updateProducto(ProductoModel.fromEntity(producto)));
    return memory.update(producto);
  }

  @override
  Future<void> deleteProducto(int id) async {
    await _bestEffortRemoteWrite(() => remote.deleteProducto(id));
    memory.remove(id);
  }

  /// Las escrituras se intentan contra la API para ejercitar PUT/DELETE, pero el
  /// estado en memoria es la fuente de verdad; un fallo remoto no rompe la app.
  Future<void> _bestEffortRemoteWrite(Future<void> Function() action) async {
    try {
      await action();
    } on ServerException {
      // Ignorado: el id puede no existir en la API pública (estado en RAM).
    } on NetworkException {
      // Ignorado: sin conexión la operación se mantiene en memoria.
    }
  }
}
