import { Producto } from '../entities/Producto';

/**
 * Contrato del repositorio (capa `domain`). La capa `data` lo implementa
 * coordinando el datasource remoto (API) y el de memoria (RAM).
 */
export interface ProductoRepository {
  getProductos(forceRefresh?: boolean): Promise<Producto[]>;
  getProducto(id: number): Promise<Producto>;
  searchProductos(query: string): Promise<Producto[]>;
  createProducto(producto: Producto): Promise<Producto>;
  updateProducto(producto: Producto): Promise<Producto>;
  deleteProducto(id: number): Promise<void>;
}
