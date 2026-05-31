import '../../../../core/usecase/usecase.dart';
import '../entities/producto.dart';
import '../repositories/producto_repository.dart';

/// Actualiza un producto (PUT a la API) y refleja el cambio en memoria.
class UpdateProducto implements UseCase<Producto, Producto> {
  final ProductoRepository repository;
  UpdateProducto(this.repository);

  @override
  Future<Producto> call(Producto producto) => repository.updateProducto(producto);
}
