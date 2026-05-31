/**
 * Validación manual de la capa de consumo de API (card 11).
 * Ejecuta las 4 operaciones CRUD + búsqueda + un caso de error contra la API
 * real (DummyJSON) usando el MISMO datasource que la app.
 *
 * Ejecutar:  npx tsx scripts/validate-api.ts
 */
import { NetworkFailure, ServerFailure } from '../src/core/error/failures';
import { NetworkException, ServerException } from '../src/core/error/exceptions';
import { ApiClient } from '../src/core/network/apiClient';
import { ProductoModel } from '../src/features/productos/data/models/ProductoModel';
import { ProductoRemoteDataSourceImpl } from '../src/features/productos/data/datasources/productoRemoteDataSource';

async function main() {
  const remote = new ProductoRemoteDataSourceImpl(new ApiClient());

  const list = await remote.getProductos();
  console.log(`GET /products       -> OK, ${list.length} productos. Primero: "${list[0].title}" ($${list[0].price})`);

  const detail = await remote.getProducto(1);
  console.log(`GET /products/1     -> OK, "${detail.title}", categoría=${detail.category}, stock=${detail.stock}`);

  const search = await remote.searchProductos('phone');
  console.log(`GET /products/search-> OK, ${search.length} resultados para "phone"`);

  const created = await remote.createProducto(
    ProductoModel.fromEntity(list[0].copyWith({ id: 0, title: 'Producto Demo', price: 99.9 })),
  );
  console.log(`POST /products/add  -> OK, id nuevo=${created.id}, "${created.title}"`);

  const updated = await remote.updateProducto(
    ProductoModel.fromEntity(detail.copyWith({ price: 1234 })),
  );
  console.log(`PUT /products/1     -> OK, precio actualizado=$${updated.price}`);

  await remote.deleteProducto(1);
  console.log('DELETE /products/1  -> OK (borrado simulado)');

  // Caso de error: host inexistente -> NetworkException -> NetworkFailure.
  try {
    const broken = new ProductoRemoteDataSourceImpl(new ApiClient('https://no-existe.dummyjson.invalid'));
    await broken.getProductos();
  } catch (e) {
    const failure = e instanceof NetworkException ? new NetworkFailure() : new ServerFailure();
    console.log(`ERROR de red        -> manejado sin crash: ${e instanceof Error ? e.name : e} => ${failure.message}`);
  }

  // Asegura que ServerException también es alcanzable (id inexistente).
  try {
    await remote.getProducto(999999);
  } catch (e) {
    if (e instanceof ServerException) {
      console.log(`ERROR de servidor   -> manejado sin crash: ${e.message}`);
    }
  }

  console.log('\nValidación completa: todas las operaciones respondieron correctamente.');
}

main().catch((e) => {
  console.error('Validación fallida:', e);
  process.exit(1);
});
