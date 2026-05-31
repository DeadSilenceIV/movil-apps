import '../../../../core/usecase/usecase.dart';
import '../repositories/producto_repository.dart';

/// Elimina un producto (DELETE a la API) y lo quita del estado en memoria.
class DeleteProducto implements UseCase<void, int> {
  final ProductoRepository repository;
  DeleteProducto(this.repository);

  @override
  Future<void> call(int id) => repository.deleteProducto(id);
}
