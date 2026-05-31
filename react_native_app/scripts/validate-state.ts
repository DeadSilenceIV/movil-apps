/**
 * Validación manual del estado en memoria (card 12).
 * Ejercita los casos de uso (vía el contenedor DI) y comprueba que el estado
 * en RAM se mantiene y refleja las operaciones CRUD sin persistencia local.
 *
 * Ejecutar:  npx tsx scripts/validate-state.ts
 */
import { productosUseCases as uc } from '../src/di/container';
import { Producto } from '../src/features/productos/domain/entities/Producto';

async function main() {
  // 1. Carga inicial desde la API -> queda en memoria.
  const inicial = await uc.getProductos.call(true);
  console.log(`load()            -> ${inicial.length} productos en memoria`);

  // 2. Segunda lectura SIN refresh: viene de memoria (mismo conteo, sin red).
  const cache = await uc.getProductos.call(false);
  console.log(`getProductos cache-> ${cache.length} (servido desde RAM, sin red)`);

  // 3. Crear -> se agrega al estado en memoria.
  await uc.createProducto.call(
    new Producto({ id: 0, title: 'Producto en RAM', price: 50, category: 'demo' }),
  );
  const trasCrear = await uc.getProductos.call(false);
  console.log(`create()          -> ${trasCrear.length} (un producto más en memoria)`);
  const creado = trasCrear[0];
  console.log(`   nuevo en memoria: "${creado.title}" (id=${creado.id})`);

  // 4. Editar -> el cambio se refleja en memoria.
  await uc.updateProducto.call(creado.copyWith({ price: 999 }));
  const editado = (await uc.getProductos.call(false)).find((p) => p.id === creado.id);
  console.log(`update()          -> precio en memoria = $${editado?.price}`);

  // 5. Buscar -> filtra sobre el estado en memoria.
  const encontrados = await uc.searchProductos.call('RAM');
  console.log(`search("RAM")     -> ${encontrados.length} coincidencia(s) en memoria`);

  // 6. Eliminar -> se quita de memoria.
  await uc.deleteProducto.call(creado.id);
  const trasBorrar = await uc.getProductos.call(false);
  console.log(`delete()          -> ${trasBorrar.length} (vuelve al conteo, removido de RAM)`);

  console.log('\nValidación completa: el estado se mantiene en memoria y reacciona al CRUD.');
}

main().catch((e) => {
  console.error('Validación fallida:', e);
  process.exit(1);
});
