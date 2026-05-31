import { UseCase } from '../../../../core/usecase/usecase';
import { Producto } from '../entities/Producto';
import { ProductoRepository } from '../repositories/ProductoRepository';

/**
 * Obtiene la lista de productos. El parámetro indica si se debe forzar la
 * recarga desde la API (true) o usar el estado en memoria (false).
 */
export class GetProductos implements UseCase<Producto[], boolean> {
  constructor(private readonly repository: ProductoRepository) {}

  call(forceRefresh = false): Promise<Producto[]> {
    return this.repository.getProductos(forceRefresh);
  }
}
