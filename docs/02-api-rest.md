# 02 · Selección y definición de la API REST

## Decisión: API pública — **DummyJSON** (`/products`)

- **URL base:** `https://dummyjson.com`
- **Recurso:** `/products`
- **Autenticación:** ninguna (público, CORS habilitado).

### Justificación (pública vs. propia)
Se elige **DummyJSON** sobre desarrollar una API propia por estas razones:

1. **CRUD completo simulado:** soporta `GET/POST/PUT/PATCH/DELETE`. Las operaciones de
   escritura devuelven el objeto modificado **pero NO persisten en el servidor**. Esto
   encaja exactamente con el requisito del proyecto de mantener el estado en **memoria
   (RAM) sin persistencia**: la app actualiza su lista en memoria tras cada operación.
2. **Comparabilidad:** ambas apps consumen la misma API y endpoints, por lo que la métrica
   de *tiempo de respuesta de la API* es justa.
3. **Estabilidad y disponibilidad:** servicio estable, sin necesidad de desplegar ni mantener
   infraestructura propia; accesible desde emulador y dispositivo físico.
4. **Modelo rico:** el recurso `products` tiene campos suficientes (title, price, category,
   stock, rating…) para una app CRUD realista.

> Descartada API propia: añadiría trabajo de despliegue/mantenimiento sin aportar a los
> objetivos de comparación (que son de cliente móvil, no de backend).

## Endpoints documentados

| Operación | Método | Ruta                         | Payload (body)                          |
|-----------|--------|------------------------------|-----------------------------------------|
| Listar    | GET    | `/products?limit=&skip=`     | —                                       |
| Detalle   | GET    | `/products/{id}`             | —                                       |
| Buscar    | GET    | `/products/search?q={texto}` | —                                       |
| Crear     | POST   | `/products/add`              | `{ "title", "price", "description", ... }` |
| Actualizar| PUT    | `/products/{id}`             | `{ "price", "title", ... }` (campos a cambiar) |
| Eliminar  | DELETE | `/products/{id}`             | —                                       |

### Parámetros útiles
- `limit` y `skip`: paginación (p. ej. `?limit=20&skip=0`).
- `select`: proyección de campos (p. ej. `?select=title,price,category,stock`).
- `/products/categories`: lista de categorías (para el formulario, opcional).

## Esquema de la respuesta JSON

### `GET /products`
```json
{
  "products": [
    { "id": 1, "title": "Essence Mascara Lash Princess", "price": 9.99,
      "category": "beauty", "stock": 99, "rating": 2.56,
      "thumbnail": "https://cdn.dummyjson.com/.../thumbnail.webp" }
  ],
  "total": 194,
  "skip": 0,
  "limit": 30
}
```

### `GET /products/{id}` (objeto Producto)
```json
{
  "id": 1,
  "title": "Essence Mascara Lash Princess",
  "description": "The Essence Mascara Lash Princess ...",
  "price": 9.99,
  "category": "beauty",
  "stock": 99,
  "rating": 2.56,
  "thumbnail": "https://cdn.dummyjson.com/.../thumbnail.webp"
}
```

### `POST /products/add` → devuelve el objeto creado con un `id` nuevo (no persistido)
```json
{ "id": 195, "title": "Producto Demo", "price": 99.9 }
```

### `PUT /products/{id}` → devuelve el objeto actualizado (no persistido)
```json
{ "id": 1, "title": "Essence Mascara Lash Princess", "price": 1234, "category": "beauty", "...": "..." }
```

### `DELETE /products/{id}` → devuelve el objeto con marca de borrado
```json
{ "id": 1, "title": "...", "isDeleted": true, "deletedOn": "2026-05-31T11:19:08.606Z" }
```

## Mapeo al modelo de dominio (`Producto`)

| Campo API     | Campo entity `Producto` | Capa de mapeo            |
|---------------|-------------------------|--------------------------|
| `id`          | `id`                    | `ProductoModel.fromJson` |
| `title`       | `title`                 | `ProductoModel.fromJson` |
| `description` | `description`           | `ProductoModel.fromJson` |
| `price`       | `price`                 | `ProductoModel.fromJson` |
| `category`    | `category`              | `ProductoModel.fromJson` |
| `stock`       | `stock`                 | `ProductoModel.fromJson` |
| `rating`      | `rating` (solo lectura) | `ProductoModel.fromJson` |
| `thumbnail`   | `thumbnail`             | `ProductoModel.fromJson` |

El acceso a estos endpoints se encapsula en el `RemoteDataSource` (capa `data`). El estado
en RAM lo gestiona el `InMemoryDataSource` + state management (regla de la skill de Clean
Architecture).

## Verificación (probado el 2026-05-31)
Todos los endpoints fueron probados con `curl` y responden correctamente:
- `GET /products` → 200, lista paginada (`total: 194`).
- `GET /products/1` → 200, objeto producto.
- `POST /products/add` → 200/201, `id` nuevo simulado.
- `PUT /products/1` → 200, objeto actualizado.
- `DELETE /products/1` → 200, `isDeleted: true`.
