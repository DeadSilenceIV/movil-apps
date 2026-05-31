import { UseCase } from '../../../../core/usecase/usecase';
import { Producto } from '../entities/Producto';
import { ProductoRepository } from '../repositories/ProductoRepository';

/** Busca/filtra productos por texto. */
export class SearchProductos implements UseCase<Producto[], string> {
  constructor(private readonly repository: ProductoRepository) {}

  call(query: string): Promise<Producto[]> {
    return this.repository.searchProductos(query);
  }
}
