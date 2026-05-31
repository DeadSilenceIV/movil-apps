import '../../../../core/usecase/usecase.dart';
import '../entities/producto.dart';
import '../repositories/producto_repository.dart';

/// Obtiene la lista de productos. El parámetro indica si se debe forzar la
/// recarga desde la API (true) o usar el estado en memoria (false).
class GetProductos implements UseCase<List<Producto>, bool> {
  final ProductoRepository repository;
  GetProductos(this.repository);

  @override
  Future<List<Producto>> call(bool forceRefresh) =>
      repository.getProductos(forceRefresh: forceRefresh);
}
