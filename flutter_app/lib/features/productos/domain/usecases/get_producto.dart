import '../../../../core/usecase/usecase.dart';
import '../entities/producto.dart';
import '../repositories/producto_repository.dart';

/// Obtiene el detalle de un producto por su id.
class GetProducto implements UseCase<Producto, int> {
  final ProductoRepository repository;
  GetProducto(this.repository);

  @override
  Future<Producto> call(int id) => repository.getProducto(id);
}
