import { Producto } from '../../domain/entities/Producto';

/** Forma cruda del producto según el esquema JSON de DummyJSON (card 02). */
export interface ProductoJson {
  id?: number;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  rating?: number;
  thumbnail?: string;
}

/**
 * DTO de `Producto`: añade serialización JSON (capa `data`). Mapea el esquema
 * de la API DummyJSON (`docs/02-api-rest.md`) a la entidad de dominio.
 */
export class ProductoModel extends Producto {
  static fromJson(json: ProductoJson): ProductoModel {
    return new ProductoModel({
      id: Number(json.id ?? 0),
      title: json.title ?? '',
      description: json.description ?? '',
      price: Number(json.price ?? 0),
      category: json.category ?? '',
      stock: Number(json.stock ?? 0),
      rating: Number(json.rating ?? 0),
      thumbnail: json.thumbnail ?? '',
    });
  }

  static fromEntity(p: Producto): ProductoModel {
    return new ProductoModel({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      rating: p.rating,
      thumbnail: p.thumbnail,
    });
  }

  /** Cuerpo enviado a la API en create/update (solo campos editables). */
  toJson(): ProductoJson {
    return {
      title: this.title,
      description: this.description,
      price: this.price,
      category: this.category,
      stock: this.stock,
    };
  }
}
