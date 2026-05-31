# Design System compartido (Flutter ＝ React Native)

> **Regla:** ambas apps deben verse y comportarse **igual**. Estos tokens son la única
> fuente de verdad del diseño. Tanto la app Flutter como la de React Native implementan
> **exactamente** la misma paleta, tipografía, espaciado, formas y componentes, para que la
> comparación sea justa y la experiencia idéntica.

## 1. Paleta de color

| Token             | Light      | Dark       | Uso                              |
|-------------------|------------|------------|----------------------------------|
| `primary`         | `#4F46E5`  | `#818CF8`  | Acciones principales, FAB, botones |
| `onPrimary`       | `#FFFFFF`  | `#1E1B4B`  | Texto/icono sobre primary        |
| `secondary`       | `#06B6D4`  | `#22D3EE`  | Acentos, chips                   |
| `background`      | `#F8FAFC`  | `#0F172A`  | Fondo de pantalla                |
| `surface`         | `#FFFFFF`  | `#1E293B`  | Tarjetas, AppBar, inputs         |
| `onSurface`       | `#0F172A`  | `#E2E8F0`  | Texto principal                  |
| `onSurfaceMuted`  | `#64748B`  | `#94A3B8`  | Texto secundario                 |
| `error`           | `#EF4444`  | `#F87171`  | Errores, borrar                  |
| `success`         | `#22C55E`  | `#4ADE80`  | Confirmaciones                   |
| `outline`         | `#E2E8F0`  | `#334155`  | Bordes, divisores                |

- **Color semilla** (para generar el esquema): `#4F46E5`.
- Soporte obligatorio de **modo claro y oscuro**.

## 2. Tipografía

Fuente del sistema (Roboto en Android / SF en iOS). Escala compartida:

| Rol          | Tamaño | Peso | Uso                          |
|--------------|--------|------|------------------------------|
| `display`    | 28     | 700  | Títulos grandes              |
| `headline`   | 24     | 700  | Título de pantalla           |
| `title`      | 20     | 600  | AppBar, secciones            |
| `subtitle`   | 16     | 600  | Título de ítem de lista      |
| `body`       | 14     | 400  | Texto general                |
| `caption`    | 12     | 400  | Metadatos, ayudas            |

## 3. Espaciado y formas

- **Escala de espaciado (px):** 4, 8, 12, 16, 24, 32. Padding base de pantalla: 16.
- **Radios:** tarjetas 16 · inputs 12 · botones 12 · FAB circular · chips 999.
- **Elevación/sombra:** sutil en tarjetas (sombra suave, ~12% opacidad, desplazamiento Y 2, blur 8).

## 4. Componentes (idénticos en ambas apps)

- **AppBar / Header:** color `surface`, título `title` (20/600), botón back e iconos de acción.
- **Ítem de lista (Card):** tarjeta con radio 16 y sombra suave; `thumbnail` 56×56 con radio 12;
  título `subtitle`; subtítulo = categoría en `onSurfaceMuted`; precio destacado (chip o texto
  `primary` en negrita). Acción de eliminar (swipe o menú).
- **FAB:** color `primary`, ícono "＋", esquina inferior derecha; abre el formulario de creación.
- **Botones:** primario *filled* (`primary`), secundario *outlined* (`outline`). Radio 12.
- **Inputs:** *outlined*, radio 12, label flotante, mensaje de error en `error`.
- **Estados:** carga (skeleton/shimmer o spinner), **vacío** (ícono + mensaje), **error**
  (mensaje + botón "reintentar").
- **Feedback:** SnackBar/Toast tras cada operación CRUD; **diálogo de confirmación** al borrar.
- **Pull-to-refresh** en la lista.

## 5. Layout de pantallas (idéntico en ambas apps)

1. **Lista:** AppBar con título + acción de búsqueda; lista de tarjetas; FAB "＋"; pull-to-refresh.
2. **Detalle:** imagen/encabezado, campos del producto con jerarquía tipográfica, botones
   *editar* y *eliminar*.
3. **Formulario (crear/editar):** inputs *outlined* con validación, botón primario *Guardar*
   y secundario *Cancelar*.

## 6. Implementación por stack (mismo resultado visual)

- **Flutter:** `ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF4F46E5), brightness: ...))`, con overrides de los tokens de esta tabla. Tema claro y oscuro centralizados en `core/theme/`.
- **React Native:** **React Native Paper** (MD3) con un tema cuyos colores usan los **mismos hex**; `ThemeProvider` global y soporte claro/oscuro. Tema centralizado en `core/theme/`.

> Cualquier cambio de diseño se hace **primero aquí** y luego se replica en ambas apps.
