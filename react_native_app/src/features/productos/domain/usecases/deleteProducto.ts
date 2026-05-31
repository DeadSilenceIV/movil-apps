import { UseCase } from '../../../../core/usecase/usecase';
import { ProductoRepository } from '../repositories/ProductoRepository';

/** Elimina un producto (DELETE a la API) y lo quita del estado en memoria. */
export class DeleteProducto implements UseCase<void, number> {
  constructor(private readonly repository: ProductoRepository) {}

  call(id: number): Promise<void> {
    return this.repository.deleteProducto(id);
  }
}
