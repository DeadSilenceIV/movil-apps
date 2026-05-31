import { UseCase } from '../../../../core/usecase/usecase';
import { Producto } from '../entities/Producto';
import { ProductoRepository } from '../repositories/ProductoRepository';

/** Obtiene el detalle de un producto por su id. */
export class GetProducto implements UseCase<Producto, number> {
  constructor(private readonly repository: ProductoRepository) {}

  call(id: number): Promise<Producto> {
    return this.repository.getProducto(id);
  }
}
