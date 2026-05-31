# react_native_app

App en **React Native + Expo** del proyecto de comparación. Implementa la gestión de
productos (CRUD sobre la API DummyJSON, estado en memoria) siguiendo **Clean Architecture**.

## Versiones (SDK utilizado)

| Paquete        | Versión    |
|----------------|------------|
| Expo SDK       | `54.0.35`  |
| React Native   | `0.81.5`   |
| React          | `19.1.0`   |
| TypeScript     | `~5.9.2`   |

> Se fijó **SDK 54** (no el 56 `latest`) por compatibilidad con la app **Expo Go** del
> Play Store, que aún no soporta SDK 56.

## Dependencias base

- **react-native-paper** (Material Design 3) — UI y tema del design system.
- **@react-navigation/native** + **native-stack** — navegación entre pantallas.
- **axios** — cliente HTTP para la API REST.
- **zustand** — gestor de estado en memoria.
- **react-native-safe-area-context** / **react-native-screens** — soporte de navegación/Paper.

## Estructura (`src/`)

Estructura objetivo según `.claude/skills/clean-architecture/SKILL.md`:

```
src/
  core/
    theme/          # tema centralizado (design system)
    error/          # exceptions.ts / failures.ts
    network/        # apiClient.ts (axios) — cliente HTTP base
    usecase/        # contrato base UseCase<T, P>
  features/productos/
    domain/         # Producto, ProductoRepository, use cases (get/create/update/delete/search)
    data/           # ProductoModel (JSON), datasources remoto + en memoria, repository impl
    presentation/
      state/        # productosStore.ts (Zustand) — estado global en RAM
      screens/      # ProductosList / ProductoDetail / ProductoForm
  navigation/       # AppNavigator.tsx — native-stack tipado (3 rutas)
  di/               # container.ts — composición de dependencias (use cases)
App.tsx             # raíz: ThemeProvider + AppNavigator
scripts/
  validate-api.ts   # validación de la capa de API contra DummyJSON
  validate-state.ts # validación del estado en memoria (CRUD en RAM)
```

## Tema / design system

Tema centralizado en `src/core/theme/` (única fuente de verdad: `docs/design-system.md`):

- **MD3** con los mismos hex que la app Flutter (semilla `#4F46E5`) en `tokens.ts`.
- `ThemeProvider` global que selecciona **claro/oscuro** según el sistema
  (`app.json` → `userInterfaceStyle: "automatic"`).
- Tokens de espaciado (escala 4/8 px), radios (tarjetas 16, controles 12) e iconografía
  `@expo/vector-icons` (vía Paper).

## Consumo de API REST (card 11)

Capa de datos sobre la misma API que la app Flutter — **DummyJSON** `/products`
(`docs/02-api-rest.md`):

- `core/network/apiClient.ts`: instancia axios (`https://dummyjson.com`) que traduce los
  errores técnicos a `ServerException` (respuesta 4xx/5xx) y `NetworkException` (timeout/sin red).
- `data/datasources/productoRemoteDataSource.ts`: las 4 operaciones CRUD
  (`GET /products`, `GET /products/{id}`, `GET /products/search`, `POST /products/add`,
  `PUT /products/{id}`, `DELETE /products/{id}`).
- `data/models/ProductoModel.ts`: (de)serialización JSON ↔ entidad de dominio `Producto`.
- `core/error/`: `Failure` de dominio (`ServerFailure`, `NetworkFailure`) que la capa de
  presentación mostrará como mensajes; los datasources lanzan las excepciones técnicas.

### Validar (petición real)

```bash
npx tsx scripts/validate-api.ts
```

Ejercita GET/POST/PUT/DELETE + búsqueda y dos casos de error (sin red / 404) contra la API
real, imprimiendo cada respuesta exitosa en el log.

## Manejo de estado en memoria (card 12)

Gestor de estado formal con **Zustand** (`features/productos/presentation/state/productosStore.ts`):

- Store global accesible desde cualquier pantalla con el hook `useProductosStore`; la UI
  reacciona automáticamente a los cambios (sin `useState` disperso).
- Mantiene la lista en **RAM** durante toda la sesión vía el `ProductoInMemoryDataSource`
  (singleton del contenedor DI). **No hay persistencia local**: al cerrar la app se pierde.
- El store invoca **casos de uso** (nunca el repositorio ni HTTP). El `ProductoRepositoryImpl`
  coordina el datasource remoto (API) y el de memoria; las escrituras se reflejan siempre en RAM.
- Estados expuestos: `status` (`initial`/`loading`/`loaded`/`error`), `items`, `error`, `query`.

Las pantallas de productos consumen el store (carga real, spinner de loading, reintento
ante error y la lista en memoria) como prueba visual de la reactividad.

### Validar (estado en memoria)

```bash
npx tsx scripts/validate-state.ts
```

Comprueba que load/create/update/search/delete se mantienen y reflejan en RAM.

## Navegación entre pantallas (card 13)

Navegación formal con **React Navigation** (`@react-navigation/native` + `native-stack`)
en `src/navigation/AppNavigator.tsx` — 3 pantallas con transiciones nativas, gesto de
retorno y header estilizado según el design system (mismos hex que la app Flutter):

- **`ProductosList`** (principal): lista desde el estado en RAM, *pull-to-refresh*, FAB
  «Nuevo» → formulario, y al tocar una fila → detalle pasando `{ id }` como parámetro.
- **`ProductoDetail`**: recibe el `id` por parámetro y **resuelve el producto desde el
  store** (evita pasar instancias no serializables); muestra imagen, título/precio, chips
  (categoría/stock/rating) y descripción, con acciones de editar y eliminar.
- **`ProductoForm`**: parámetro `id` opcional (presente = edición con campos precargados);
  inputs `outlined` con validación (título obligatorio, precio > 0); guarda vía el store y
  regresa con `goBack()`.

Las rutas y sus parámetros están tipados en `RootStackParamList`, por lo que `navigate`
verifica en compilación que cada pantalla reciba los parámetros correctos. El back gesture
nativo no rompe el estado: la lista permanece en RAM en el store global.

## Ejecutar

```bash
npm install
npx expo start
```

Abre la app en **Expo Go** (escanea el QR) o en un emulador Android (`a`).
