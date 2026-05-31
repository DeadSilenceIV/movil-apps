import '../../../../core/network/api_client.dart';
import '../models/producto_model.dart';

/// Acceso a la API REST de productos (DummyJSON). Solo conoce HTTP/JSON.
abstract interface class ProductoRemoteDataSource {
  Future<List<ProductoModel>> getProductos();
  Future<ProductoModel> getProducto(int id);
  Future<List<ProductoModel>> searchProductos(String query);
  Future<ProductoModel> createProducto(ProductoModel producto);
  Future<ProductoModel> updateProducto(ProductoModel producto);
  Future<void> deleteProducto(int id);
}

class ProductoRemoteDataSourceImpl implements ProductoRemoteDataSource {
  final ApiClient client;
  ProductoRemoteDataSourceImpl(this.client);

  @override
  Future<List<ProductoModel>> getProductos() async {
    final json = await client.get('/products?limit=30');
    final list = (json['products'] as List).cast<Map<String, dynamic>>();
    return list.map(ProductoModel.fromJson).toList();
  }

  @override
  Future<ProductoModel> getProducto(int id) async {
    final json = await client.get('/products/$id');
    return ProductoModel.fromJson(json as Map<String, dynamic>);
  }

  @override
  Future<List<ProductoModel>> searchProductos(String query) async {
    final json = await client.get('/products/search?q=${Uri.encodeQueryComponent(query)}');
    final list = (json['products'] as List).cast<Map<String, dynamic>>();
    return list.map(ProductoModel.fromJson).toList();
  }

  @override
  Future<ProductoModel> createProducto(ProductoModel producto) async {
    final json = await client.post('/products/add', producto.toJson());
    return ProductoModel.fromJson(json as Map<String, dynamic>);
  }

  @override
  Future<ProductoModel> updateProducto(ProductoModel producto) async {
    final json = await client.put('/products/${producto.id}', producto.toJson());
    return ProductoModel.fromJson(json as Map<String, dynamic>);
  }

  @override
  Future<void> deleteProducto(int id) async {
    await client.delete('/products/$id');
  }
}
