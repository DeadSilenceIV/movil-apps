// Entidad de dominio `Producto` (pura, sin serialización ni dependencias de
// frameworks). El mapeo JSON vive en la capa `data` (`ProductoModel`).

export interface ProductoProps {
  id: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  stock?: number;
  rating?: number;
  thumbnail?: string;
}

export class Producto {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly stock: number;
  readonly rating: number;
  readonly thumbnail: string;

  constructor(props: ProductoProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description ?? '';
    this.price = props.price;
    this.category = props.category ?? '';
    this.stock = props.stock ?? 0;
    this.rating = props.rating ?? 0;
    this.thumbnail = props.thumbnail ?? '';
  }

  copyWith(changes: Partial<ProductoProps>): Producto {
    return new Producto({
      id: changes.id ?? this.id,
      title: changes.title ?? this.title,
      description: changes.description ?? this.description,
      price: changes.price ?? this.price,
      category: changes.category ?? this.category,
      stock: changes.stock ?? this.stock,
      rating: changes.rating ?? this.rating,
      thumbnail: changes.thumbnail ?? this.thumbnail,
    });
  }
}
