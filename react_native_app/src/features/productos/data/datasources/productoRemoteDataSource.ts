import { ApiClient } from '../../../../core/network/apiClient';
import { ProductoJson, ProductoModel } from '../models/ProductoModel';

interface ProductosListJson {
  products: ProductoJson[];
  total: number;
  skip: number;
  limit: number;
}

/** Acceso a la API REST de productos (DummyJSON). Solo conoce HTTP/JSON. */
export interface ProductoRemoteDataSource {
  getProductos(): Promise<ProductoModel[]>;
  getProducto(id: number): Promise<ProductoModel>;
  searchProductos(query: string): Promise<ProductoModel[]>;
  createProducto(producto: ProductoModel): Promise<ProductoModel>;
  updateProducto(producto: ProductoModel): Promise<ProductoModel>;
  deleteProducto(id: number): Promise<void>;
}

export class ProductoRemoteDataSourceImpl implements ProductoRemoteDataSource {
  constructor(private readonly client: ApiClient) {}

  async getProductos(): Promise<ProductoModel[]> {
    const json = await this.client.get<ProductosListJson>('/products?limit=30');
    return json.products.map(ProductoModel.fromJson);
  }

  async getProducto(id: number): Promise<ProductoModel> {
    const json = await this.client.get<ProductoJson>(`/products/${id}`);
    return ProductoModel.fromJson(json);
  }

  async searchProductos(query: string): Promise<ProductoModel[]> {
    const json = await this.client.get<ProductosListJson>(
      `/products/search?q=${encodeURIComponent(query)}`,
    );
    return json.products.map(ProductoModel.fromJson);
  }

  async createProducto(producto: ProductoModel): Promise<ProductoModel> {
    const json = await this.client.post<ProductoJson>(
      '/products/add',
      producto.toJson(),
    );
    return ProductoModel.fromJson(json);
  }

  async updateProducto(producto: ProductoModel): Promise<ProductoModel> {
    const json = await this.client.put<ProductoJson>(
      `/products/${producto.id}`,
      producto.toJson(),
    );
    return ProductoModel.fromJson(json);
  }

  async deleteProducto(id: number): Promise<void> {
    await this.client.delete<ProductoJson>(`/products/${id}`);
  }
}
