import { NetworkException, ServerException } from '../../../../core/error/exceptions';
import { NetworkFailure, ServerFailure } from '../../../../core/error/failures';
import { Producto } from '../../domain/entities/Producto';
import { ProductoRepository } from '../../domain/repositories/ProductoRepository';
import { ProductoInMemoryDataSource } from '../datasources/productoInMemoryDataSource';
import { ProductoRemoteDataSource } from '../datasources/productoRemoteDataSource';
import { ProductoModel } from '../models/ProductoModel';

/**
 * Implementación del repositorio: coordina el datasource remoto (API REST) y
 * el de memoria (RAM). El estado canónico vive en memoria; las escrituras se
 * envían a la API (que las simula) y siempre se reflejan en memoria.
 */
export class ProductoRepositoryImpl implements ProductoRepository {
  constructor(
    private readonly remote: ProductoRemoteDataSource,
    private readonly memory: ProductoInMemoryDataSource,
  ) {}

  async getProductos(forceRefresh = false): Promise<Producto[]> {
    if (this.memory.isEmpty || forceRefresh) {
      try {
        const remoteItems = await this.remote.getProductos();
        this.memory.setAll(remoteItems);
      } catch (e) {
        throw this.toFailure(e);
      }
    }
    return this.memory.getAll();
  }

  async getProducto(id: number): Promise<Producto> {
    const cached = this.memory.getById(id);
    if (cached) return cached;
    try {
      return await this.remote.getProducto(id);
    } catch (e) {
      throw this.toFailure(e);
    }
  }

  async searchProductos(query: string): Promise<Producto[]> {
    if (this.memory.isEmpty) await this.getProductos();
    return this.memory.search(query);
  }

  async createProducto(producto: Producto): Promise<Producto> {
    // POST a la API (simulada). Si hay red, usamos el id que devuelve; si no,
    // el datasource de memoria asigna un id local. El producto siempre se crea.
    let remoteId: number | null = null;
    try {
      const created = await this.remote.createProducto(ProductoModel.fromEntity(producto));
      remoteId = created.id;
    } catch (e) {
      if (e instanceof NetworkException) {
        remoteId = null; // sin conexión: se crea solo en memoria
      } else {
        throw this.toFailure(e);
      }
    }
    const toStore = remoteId !== null ? producto.copyWith({ id: remoteId }) : producto;
    return this.memory.add(toStore);
  }

  async updateProducto(producto: Producto): Promise<Producto> {
    // PUT a la API (mejor esfuerzo: la API solo conoce ids del servidor).
    await this.bestEffortRemoteWrite(() =>
      this.remote.updateProducto(ProductoModel.fromEntity(producto)),
    );
    return this.memory.update(producto);
  }

  async deleteProducto(id: number): Promise<void> {
    await this.bestEffortRemoteWrite(() => this.remote.deleteProducto(id));
    this.memory.remove(id);
  }

  private toFailure(e: unknown): Error {
    if (e instanceof ServerException) return new ServerFailure(e.message);
    if (e instanceof NetworkException) return new NetworkFailure();
    return new ServerFailure();
  }

  /**
   * Las escrituras se intentan contra la API para ejercitar PUT/DELETE, pero el
   * estado en memoria es la fuente de verdad; un fallo remoto no rompe la app.
   */
  private async bestEffortRemoteWrite(action: () => Promise<unknown>): Promise<void> {
    try {
      await action();
    } catch {
      // Ignorado: el id puede no existir en la API pública o no haber conexión;
      // la operación se mantiene en memoria (estado en RAM).
    }
  }
}
