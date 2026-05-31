import '../../../../core/usecase/usecase.dart';
import '../entities/producto.dart';
import '../repositories/producto_repository.dart';

/// Crea un producto (POST a la API) y lo agrega al estado en memoria.
class CreateProducto implements UseCase<Producto, Producto> {
  final ProductoRepository repository;
  CreateProducto(this.repository);

  @override
  Future<Producto> call(Producto producto) => repository.createProducto(producto);
}
