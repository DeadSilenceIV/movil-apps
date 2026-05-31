/// Entidad de dominio `Producto` (pura, sin serialización ni dependencias de
/// frameworks). El mapeo JSON vive en la capa `data` (`ProductoModel`).
class Producto {
  final int id;
  final String title;
  final String description;
  final double price;
  final String category;
  final int stock;
  final double rating;
  final String thumbnail;

  const Producto({
    required this.id,
    required this.title,
    this.description = '',
    required this.price,
    this.category = '',
    this.stock = 0,
    this.rating = 0,
    this.thumbnail = '',
  });

  Producto copyWith({
    int? id,
    String? title,
    String? description,
    double? price,
    String? category,
    int? stock,
    double? rating,
    String? thumbnail,
  }) {
    return Producto(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      price: price ?? this.price,
      category: category ?? this.category,
      stock: stock ?? this.stock,
      rating: rating ?? this.rating,
      thumbnail: thumbnail ?? this.thumbnail,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is Producto && other.id == id);

  @override
  int get hashCode => id.hashCode;
}
