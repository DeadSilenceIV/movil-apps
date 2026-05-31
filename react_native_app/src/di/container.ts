import { ApiClient } from '../core/network/apiClient';
import { ProductoInMemoryDataSource } from '../features/productos/data/datasources/productoInMemoryDataSource';
import { ProductoRemoteDataSourceImpl } from '../features/productos/data/datasources/productoRemoteDataSource';
import { ProductoRepositoryImpl } from '../features/productos/data/repositories/productoRepositoryImpl';
import { CreateProducto } from '../features/productos/domain/usecases/createProducto';
import { DeleteProducto } from '../features/productos/domain/usecases/deleteProducto';
import { GetProducto } from '../features/productos/domain/usecases/getProducto';
import { GetProductos } from '../features/productos/domain/usecases/getProductos';
import { SearchProductos } from '../features/productos/domain/usecases/searchProductos';
import { UpdateProducto } from '../features/productos/domain/usecases/updateProducto';

/**
 * Punto único de composición de dependencias (Clean Architecture): nadie
 * instancia sus dependencias, se inyectan desde aquí. El datasource en memoria
 * es un singleton, por lo que el estado en RAM persiste durante toda la sesión.
 */
const apiClient = new ApiClient();
const remoteDataSource = new ProductoRemoteDataSourceImpl(apiClient);
const inMemoryDataSource = new ProductoInMemoryDataSource();
const productoRepository = new ProductoRepositoryImpl(remoteDataSource, inMemoryDataSource);

export const productosUseCases = {
  getProductos: new GetProductos(productoRepository),
  getProducto: new GetProducto(productoRepository),
  searchProductos: new SearchProductos(productoRepository),
  createProducto: new CreateProducto(productoRepository),
  updateProducto: new UpdateProducto(productoRepository),
  deleteProducto: new DeleteProducto(productoRepository),
};
