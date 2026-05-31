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

  load: (refresh?: boolean) => Promise<void>;
  search: (value: string) => void;
  create: (producto: Producto) => Promise<boolean>;
  edit: (producto: Producto) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
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
      set({ items, status: 'loaded' });
      return true;
    } catch (e) {
      set({ error: messageOf(e) });
      return false;
    }
  },

  edit: async (producto: Producto) => {
    try {
      await productosUseCases.updateProducto.call(producto);
      const items = await productosUseCases.getProductos.call(false);
      set({ items });
      return true;
    } catch (e) {
      set({ error: messageOf(e) });
      return false;
    }
  },

  remove: async (id: number) => {
    try {
      await productosUseCases.deleteProducto.call(id);
      const items = await productosUseCases.getProductos.call(false);
      set({ items });
      return true;
    } catch (e) {
      set({ error: messageOf(e) });
      return false;
    }
  },
}));

/** Selector: lista visible aplicando el filtro de búsqueda sobre el estado en memoria. */
export const selectVisibleProductos = (state: ProductosState): Producto[] => {
  const q = state.query.trim().toLowerCase();
  if (q === '') return state.items;
  return state.items.filter(
    (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
  );
};
