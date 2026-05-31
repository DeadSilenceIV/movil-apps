import { Producto } from '../../domain/entities/Producto';

/**
 * Estado en memoria (RAM) de los productos. NO hay persistencia local:
 * al cerrar la app, estos datos se pierden (requisito del proyecto).
 */
export class ProductoInMemoryDataSource {
  private items: Producto[] = [];
  private nextLocalId = 100000; // ids para productos creados localmente

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  getAll(): Producto[] {
    return [...this.items];
  }

  getById(id: number): Producto | undefined {
    return this.items.find((item) => item.id === id);
  }

  setAll(items: Producto[]): void {
    this.items = [...items];
  }

  /** Agrega un producto. Si no trae id válido, asigna uno local. */
  add(producto: Producto): Producto {
    const created = producto.id > 0 ? producto : producto.copyWith({ id: this.nextLocalId++ });
    this.items = [created, ...this.items];
    return created;
  }

  update(producto: Producto): Producto {
    const index = this.items.findIndex((e) => e.id === producto.id);
    if (index !== -1) {
      this.items = this.items.map((e) => (e.id === producto.id ? producto : e));
    } else {
      this.items = [producto, ...this.items];
    }
    return producto;
  }

  remove(id: number): void {
    this.items = this.items.filter((e) => e.id !== id);
  }

  search(query: string): Producto[] {
    const q = query.trim().toLowerCase();
    if (q === '') return this.getAll();
    return this.items.filter(
      (e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q),
    );
  }
}
