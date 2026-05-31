# 01 · Alcance, modelo de datos y casos de uso comunes

> Documento base del proyecto. Define las funcionalidades **idénticas** que tendrán ambas
> apps (Flutter y React Native/Expo) para garantizar una comparación objetiva.
> Toda la implementación sigue **Clean Architecture** (ver `.claude/skills/clean-architecture`).

## 1. Objetivo de la app

Construir una aplicación de gestión de **Productos** que consume una API REST pública,
mantiene el estado en **memoria (RAM, sin persistencia local)** y permite operaciones
**CRUD** completas, con navegación entre un mínimo de 3 pantallas y un patrón formal de
gestión de estado. La misma app se implementa en los dos stacks para medir y comparar
5 métricas.

## 2. Modelo de datos común

Entidad principal: **`Producto`** (alineada con el recurso `/products` de la API — ver card 02).

| Campo         | Tipo      | Requerido | Notas                                   |
|---------------|-----------|-----------|-----------------------------------------|
| `id`          | int       | sí (auto) | Generado por la API / estado en memoria |
| `title`       | string    | sí        | Nombre del producto                     |
| `description` | string    | no        | Descripción larga                       |
| `price`       | double    | sí        | Precio unitario (> 0)                   |
| `category`    | string    | no        | Categoría                               |
| `stock`       | int       | no        | Unidades disponibles (>= 0)             |
| `rating`      | double    | no        | Solo lectura (viene de la API)          |
| `thumbnail`   | string    | no        | URL de imagen                           |

La **entity** de dominio es pura (sin serialización). El `fromJson/toJson` vive en la capa
`data` como `ProductoModel`/DTO (regla de la skill).

### Validaciones de negocio
- `title`: no vacío, longitud 1–100.
- `price`: numérico, mayor que 0.
- `stock`: entero, mayor o igual a 0.

## 3. Casos de uso (CRUD + navegación)

Cada caso de uso es una clase/función con una sola responsabilidad en la capa `domain`:

| Caso de uso       | Operación | Endpoint (ver card 02)        | Descripción                          |
|-------------------|-----------|-------------------------------|--------------------------------------|
| `GetProductos`    | Read      | `GET /products`               | Lista paginada para la pantalla principal |
| `GetProductoById` | Read      | `GET /products/{id}`          | Detalle de un producto               |
| `SearchProductos` | Read      | `GET /products/search?q=`     | Búsqueda/filtro de la lista          |
| `CreateProducto`  | Create    | `POST /products/add`          | Alta de un producto                  |
| `UpdateProducto`  | Update    | `PUT /products/{id}`          | Edición de un producto               |
| `DeleteProducto`  | Delete    | `DELETE /products/{id}`       | Baja de un producto                  |

> La API simula la escritura sin persistir en servidor; el **estado real se mantiene en
> memoria (RAM)** dentro del state management. Tras un `Create/Update/Delete` exitoso se
> actualiza la lista en memoria. Al reiniciar la app, el estado se pierde (requisito).

## 4. Definición de pantallas (mínimo 3)

1. **Pantalla principal — Lista de productos** (`ProductosListPage` / `ProductosListScreen`)
   - Lista dinámica (`ListView.builder` / `FlatList`) con título, precio y categoría.
   - Acciones: refrescar, buscar, ir a detalle, botón "＋" para crear, eliminar (swipe/botón).
2. **Pantalla de detalle** (`ProductoDetailPage` / `ProductoDetailScreen`)
   - Muestra todos los campos del producto seleccionado.
   - Acciones: editar, eliminar, volver.
3. **Pantalla de creación/edición** (`ProductoFormPage` / `ProductoFormScreen`)
   - Formulario con validaciones. Reutilizada para **crear** (vacío) y **editar** (precargado).
   - Acciones: guardar (Create o Update), cancelar.

### Flujo de navegación
```
Lista ──(tap item)──► Detalle ──(editar)──► Formulario(edición) ──guardar──► Lista
  │                                                                   ▲
  └──────────────(＋ crear)──────► Formulario(creación) ─────guardar──┘
```
Navegación con `Navigator`/`go_router` (Flutter) y `React Navigation`/`Expo Router` (RN).

## 5. Gestión de estado (patrón formal)

- **Flutter:** Provider / Riverpod / Bloc (a fijar en la card de scaffolding). El estado expone
  la lista de productos en memoria, el estado de carga y los errores.
- **React Native:** Redux Toolkit / Zustand / Context. Mismo contrato conceptual.
- En ambos casos, la UI invoca **use cases**, nunca repositorios concretos ni HTTP directo.

## 6. Criterios de aceptación idénticos para ambas plataformas

- [ ] La app lista productos obtenidos de la API en la pantalla principal (lista dinámica).
- [ ] Se puede ver el detalle de un producto.
- [ ] Se puede **crear** un producto (formulario + validaciones) y aparece en la lista en memoria.
- [ ] Se puede **editar** un producto y los cambios se reflejan en lista y detalle.
- [ ] Se puede **eliminar** un producto y desaparece de la lista en memoria.
- [ ] La búsqueda/filtro funciona sobre la lista.
- [ ] El estado se mantiene en memoria (RAM) y **no** se persiste localmente.
- [ ] Navegación operativa entre las 3 pantallas.
- [ ] Misma lógica de negocio, mismas pantallas y mismos campos en Flutter y React Native.

## 7. Trazabilidad con Clean Architecture

| Capa           | Artefactos de este documento                                  |
|----------------|---------------------------------------------------------------|
| `domain`       | Entity `Producto`, interfaz `ProductoRepository`, los 6 use cases |
| `data`         | `ProductoModel` (DTO), `RemoteDataSource` (API), `InMemoryDataSource` (RAM), `ProductoRepositoryImpl` |
| `presentation` | 3 pantallas + state management + widgets                      |
