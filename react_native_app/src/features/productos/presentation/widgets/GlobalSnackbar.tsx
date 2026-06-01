import { Snackbar } from 'react-native-paper';

import { useProductosStore } from '../state/productosStore';

/**
 * Snackbar global de feedback CRUD (design system §4). Lee el mensaje del store
 * para que el aviso sobreviva a la navegación entre pantallas (equivalente al
 * `ScaffoldMessenger` de la app Flutter): crear/editar desde el formulario navega
 * de regreso, y el aviso se muestra sobre la lista.
 */
export default function GlobalSnackbar() {
  const notice = useProductosStore((s) => s.notice);
  const dismissNotice = useProductosStore((s) => s.dismissNotice);

  return (
    <Snackbar visible={notice !== ''} onDismiss={dismissNotice} duration={2500}>
      {notice}
    </Snackbar>
  );
}
