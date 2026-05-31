import { UseCase } from '../../../../core/usecase/usecase';
import { Producto } from '../entities/Producto';
import { ProductoRepository } from '../repositories/ProductoRepository';

/** Crea un producto (POST a la API) y lo agrega al estado en memoria. */
export class CreateProducto implements UseCase<Producto, Producto> {
  constructor(private readonly repository: ProductoRepository) {}

  call(producto: Producto): Promise<Producto> {
    return this.repository.createProducto(producto);
  }
}
