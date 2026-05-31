import '../../../../core/usecase/usecase.dart';
import '../entities/producto.dart';
import '../repositories/producto_repository.dart';

/// Busca/filtra productos por texto.
class SearchProductos implements UseCase<List<Producto>, String> {
  final ProductoRepository repository;
  SearchProductos(this.repository);

  @override
  Future<List<Producto>> call(String query) => repository.searchProductos(query);
}
