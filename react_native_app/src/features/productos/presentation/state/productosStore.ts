import { create } from 'zustand';

import { productosUseCases } from '../../../../di/container';
import { Producto } from '../../domain/entities/Producto';

export type ProductosStatus = 'initial' | 'loading' | 'loaded' | 'error';

interface ProductosState {
  status: ProductosStatus;
  /** Lista completa en memoria (RAM) durante toda la sesión. */
  items: Producto[];
  error: string;
  query: string;
  /** Mensaje de feedback (Snackbar) tras una operación CRUD; '' = oculto. */
  notice: string;

  load: (refresh?: boolean) => Promise<void>;
  search: (value: string) => void;
  create: (producto: Producto) => Promise<boolean>;
  edit: (producto: Producto) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
  dismissNotice: () => void;
}

const messageOf = (e: unknown): string =>
  e instanceof Error ? e.message : 'Ocurrió un error inesperado.';

/**
 * Gestor de estado formal (Zustand). Mantiene la lista de productos en memoria
 * durante toda la sesión y notifica a la UI ante cambios. Invoca casos de uso,
 * nunca el repositorio o HTTP directamente. Es un store global accesible desde
 * cualquier pantalla mediante el hook `useProductosStore`.
 */
export const useProductosStore = create<ProductosState>((set, get) => ({
  status: 'initial',
  items: [],
  error: '',
  query: '',
  notice: '',

  load: async (refresh = false) => {
    set({ status: 'loading', error: '' });
    try {
      const items = await productosUseCases.getProductos.call(refresh);
      set({ items, status: 'loaded' });
    } catch (e) {
      set({ error: messageOf(e), status: 'error' });
    }
  },

  search: (value: string) => set({ query: value }),

  create: async (producto: Producto) => {
    try {
      await productosUseCases.createProducto.call(producto);
      const items = await productosUseCases.getProductos.call(false);
      set({ items, status: 'loaded', notice: 'Producto creado' });
      return true;
    } catch (e) {
      set({ error: messageOf(e), notice: 'No se pudo crear el producto' });
      return false;
    }
  },

  edit: async (producto: Producto) => {
    try {
      await productosUseCases.updateProducto.call(producto);
      const items = await productosUseCases.getProductos.call(false);
      set({ items, notice: 'Producto actualizado' });
      return true;
    } catch (e) {
      set({ error: messageOf(e), notice: 'No se pudo actualizar el producto' });
      return false;
    }
  },

  remove: async (id: number) => {
    try {
      await productosUseCases.deleteProducto.call(id);
      const items = await productosUseCases.getProductos.call(false);
      set({ items, notice: 'Producto eliminado' });
      return true;
    } catch (e) {
      set({ error: messageOf(e), notice: 'No se pudo eliminar el producto' });
      return false;
    }
  },

  dismissNotice: () => set({ notice: '' }),
}));

/**
 * Filtra la lista en memoria por el texto de búsqueda. Es una función pura (no un
 * selector de zustand) para que la pantalla la memoice con `useMemo`: devolver un
 * array nuevo desde un selector de zustand v5 provoca un bucle infinito de render
 * ("getSnapshot should be cached"), ya que la referencia cambia en cada llamada.
 */
export const filterProductos = (items: Producto[], query: string): Producto[] => {
  const q = query.trim().toLowerCase();
  if (q === '') return items;
  return items.filter(
    (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
  );
};
