import { UseCase } from '../../../../core/usecase/usecase';
import { Producto } from '../entities/Producto';
import { ProductoRepository } from '../repositories/ProductoRepository';

/** Actualiza un producto (PUT a la API) y refleja el cambio en memoria. */
export class UpdateProducto implements UseCase<Producto, Producto> {
  constructor(private readonly repository: ProductoRepository) {}

  call(producto: Producto): Promise<Producto> {
    return this.repository.updateProducto(producto);
  }
}
