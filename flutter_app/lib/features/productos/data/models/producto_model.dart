import '../../domain/entities/producto.dart';

/// DTO de `Producto`: añade serialización JSON (capa `data`). Mapea el esquema
/// de la API DummyJSON (`docs/02-api-rest.md`) a la entidad de dominio.
class ProductoModel extends Producto {
  const ProductoModel({
    required super.id,
    required super.title,
    super.description,
    required super.price,
    super.category,
    super.stock,
    super.rating,
    super.thumbnail,
  });

  factory ProductoModel.fromJson(Map<String, dynamic> json) {
    return ProductoModel(
      id: (json['id'] as num?)?.toInt() ?? 0,
      title: (json['title'] as String?) ?? '',
      description: (json['description'] as String?) ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0,
      category: (json['category'] as String?) ?? '',
      stock: (json['stock'] as num?)?.toInt() ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 0,
      thumbnail: (json['thumbnail'] as String?) ?? '',
    );
  }

  /// Cuerpo enviado a la API en create/update (solo campos editables).
  Map<String, dynamic> toJson() => {
        'title': title,
        'description': description,
        'price': price,
        'category': category,
        'stock': stock,
      };

  factory ProductoModel.fromEntity(Producto p) => ProductoModel(
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        stock: p.stock,
        rating: p.rating,
        thumbnail: p.thumbnail,
      );
}
