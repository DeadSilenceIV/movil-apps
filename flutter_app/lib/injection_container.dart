import 'package:get_it/get_it.dart';

import 'core/network/api_client.dart';
import 'features/productos/data/datasources/producto_in_memory_datasource.dart';
import 'features/productos/data/datasources/producto_remote_datasource.dart';
import 'features/productos/data/repositories/producto_repository_impl.dart';
import 'features/productos/domain/repositories/producto_repository.dart';
import 'features/productos/domain/usecases/create_producto.dart';
import 'features/productos/domain/usecases/delete_producto.dart';
import 'features/productos/domain/usecases/get_producto.dart';
import 'features/productos/domain/usecases/get_productos.dart';
import 'features/productos/domain/usecases/search_productos.dart';
import 'features/productos/domain/usecases/update_producto.dart';
import 'features/productos/presentation/state/productos_provider.dart';

/// Service locator. Punto único de composición de dependencias (Clean
/// Architecture): nadie instancia sus dependencias, se inyectan desde aquí.
final GetIt sl = GetIt.instance;

void initDependencies() {
  // Core
  sl.registerLazySingleton<ApiClient>(() => ApiClient());

  // Data sources
  sl.registerLazySingleton<ProductoRemoteDataSource>(
      () => ProductoRemoteDataSourceImpl(sl()));
  sl.registerLazySingleton<ProductoInMemoryDataSource>(
      () => ProductoInMemoryDataSource());

  // Repository
  sl.registerLazySingleton<ProductoRepository>(
      () => ProductoRepositoryImpl(remote: sl(), memory: sl()));

  // Use cases
  sl.registerFactory(() => GetProductos(sl()));
  sl.registerFactory(() => GetProducto(sl()));
  sl.registerFactory(() => SearchProductos(sl()));
  sl.registerFactory(() => CreateProducto(sl()));
  sl.registerFactory(() => UpdateProducto(sl()));
  sl.registerFactory(() => DeleteProducto(sl()));

  // State (Provider)
  sl.registerFactory(() => ProductosProvider(
        getProductos: sl(),
        createProducto: sl(),
        updateProducto: sl(),
        deleteProducto: sl(),
      ));
}
