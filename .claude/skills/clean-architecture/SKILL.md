---
name: clean-architecture
description: Guía obligatoria para desarrollar la app móvil (Flutter y React Native) aplicando Clean Architecture. Úsala SIEMPRE que se cree, modifique o revise código de las apps: estructura de carpetas por capas (domain/data/presentation), regla de dependencias, separación de capas, patrones (entities, use cases, repositories, datasources) y reglas equivalentes para cada stack. Aplica al consumo de API REST, estado en memoria, CRUD, navegación y gestión de estado del proyecto de comparación Flutter vs React Native.
---

# Clean Architecture — Estándar de desarrollo

Todo el código de las apps (Flutter y React Native/Expo) DEBE seguir Clean Architecture.
Esta skill define la estructura, la regla de dependencias y los patrones obligatorios.

## Principio rector: la Regla de Dependencias

Las dependencias del código fuente apuntan **solo hacia adentro**. Las capas internas no
conocen nada de las externas.

```
presentation  ──►  domain  ◄──  data
   (UI)            (núcleo)      (API/fuentes)
```

- **domain** no importa NADA de `data` ni de `presentation`, ni de frameworks (sin `flutter`,
  sin `react`, sin `axios`, sin `http`). Es Dart/TypeScript puro.
- **data** depende de **domain** (implementa sus interfaces). Conoce HTTP, JSON, DTOs.
- **presentation** depende de **domain** (invoca use cases). Nunca llama a `data` directamente.
- El flujo de control va de afuera hacia adentro; las dependencias de compilación, al revés
  (inversión de dependencias mediante interfaces declaradas en `domain`).

Si una clase de UI necesita datos, llama a un **Use Case**, no a un repositorio concreto ni a
un cliente HTTP. Si te ves importando `axios`/`http` dentro de `presentation` o `domain`,
está mal: refactoriza.

## Las tres capas

### 1. domain (núcleo, sin dependencias externas)
- **entities**: modelos de negocio puros (p. ej. `Item`). Sin anotaciones de serialización.
- **repositories**: interfaces abstractas (contratos). P. ej. `ItemRepository` con
  `getAll`, `getById`, `create`, `update`, `delete`.
- **usecases**: una clase/función por caso de uso, con un único método público
  (`call`/`execute`). P. ej. `GetItems`, `CreateItem`, `UpdateItem`, `DeleteItem`,
  `GetItemById`. Orquestan reglas de negocio y dependen solo de interfaces de repositorio.

### 2. data (detalles: API REST, mapeo, fuentes)
- **models / DTOs**: extienden o mapean a entities; aquí va `fromJson`/`toJson`.
- **datasources**: acceso crudo a la fuente. Para este proyecto:
  - `RemoteDataSource` → consume la API REST (CRUD).
  - `InMemoryDataSource` → estado en RAM (sin persistencia local; requisito del documento).
- **repositories (impl)**: implementan las interfaces de `domain`, combinando datasources y
  mapeando DTO ↔ entity. Manejan errores y los traducen a fallos de dominio.

### 3. presentation (UI y estado)
- **state management**: el patrón formal del stack (Provider/Riverpod/Bloc en Flutter;
  Redux Toolkit/Zustand/Context en RN). El estado invoca use cases, nunca repositorios o
  HTTP directamente.
- **pages/screens** y **widgets/components**: solo renderizan y despachan eventos/acciones.
  Sin lógica de negocio ni llamadas de red en los widgets.

## Estructura de carpetas

### Flutter (`lib/`)
```
lib/
  core/
    error/            # Failures, Exceptions
    network/          # cliente HTTP base
    usecase/          # contrato base UseCase<Type, Params>
  features/
    items/
      domain/
        entities/        item.dart
        repositories/    item_repository.dart        # abstracto
        usecases/        get_items.dart, create_item.dart, ...
      data/
        models/          item_model.dart             # fromJson/toJson
        datasources/     item_remote_datasource.dart
                         item_in_memory_datasource.dart
        repositories/    item_repository_impl.dart
      presentation/
        state/           items_provider.dart / items_bloc.dart
        pages/           items_page.dart, item_detail_page.dart, item_form_page.dart
        widgets/         item_tile.dart
  injection_container.dart   # composición de dependencias (get_it u similar)
  main.dart
```

### React Native / Expo (`src/`)
```
src/
  core/
    error/             # Failure types
    network/           # cliente HTTP base (instancia axios/fetch)
    usecase/           # tipo UseCase base
  features/
    items/
      domain/
        entities/        Item.ts
        repositories/    ItemRepository.ts           # interface
        usecases/        getItems.ts, createItem.ts, ...
      data/
        models/          ItemModel.ts                # mappers fromJson/toJson
        datasources/     itemRemoteDataSource.ts
                         itemInMemoryDataSource.ts
        repositories/    itemRepositoryImpl.ts
      presentation/
        state/           itemsSlice.ts / itemsStore.ts / ItemsContext.tsx
        screens/         ItemsScreen.tsx, ItemDetailScreen.tsx, ItemFormScreen.tsx
        components/       ItemTile.tsx
  di/                  # contenedor/composición de dependencias
  App.tsx
```

> Mantén la MISMA distribución de features y nombres equivalentes en ambos stacks. Eso hace
> la comparación Flutter vs React Native justa y trazable.

## Reglas obligatorias (checklist al escribir/revisar código)

- [ ] La capa `domain` no importa frameworks de UI, HTTP, ni la capa `data`.
- [ ] `presentation` invoca **use cases**, nunca repositorios concretos ni clientes HTTP.
- [ ] Cada repositorio tiene una **interfaz en `domain`** y su **impl en `data`**.
- [ ] DTOs y `fromJson/toJson` viven solo en `data/models`; las entities quedan limpias.
- [ ] El CRUD pasa por use cases → repository → datasources (remote para API, in-memory para RAM).
- [ ] El estado en memoria NO se persiste en disco (requisito del documento).
- [ ] Las dependencias se inyectan desde un punto de composición (DI container), no se
      instancian dentro de las clases que las usan.
- [ ] Un caso de uso = una responsabilidad (Single Responsibility).
- [ ] Nombres y estructura equivalentes entre la app Flutter y la app React Native.

## Flujo de una operación (ejemplo: crear ítem)

1. UI (page/screen) despacha la acción al state management.
2. State management invoca el use case `CreateItem(params)`.
3. `CreateItem` llama a `ItemRepository.create(item)` (interfaz de domain).
4. `ItemRepositoryImpl` mapea entity→DTO, llama al `RemoteDataSource` (API REST) y/o
   actualiza el `InMemoryDataSource` (estado RAM), mapea la respuesta DTO→entity.
5. El resultado vuelve por la misma cadena; el state management actualiza el estado y la UI
   se reconstruye.

## Al generar código

- Crea primero `domain` (entities, repository interface, use cases), luego `data`, luego
  `presentation`. Así la regla de dependencias se respeta por construcción.
- Si el usuario pide "añade el CRUD de X", genera las 3 capas para esa feature, no un atajo
  con la llamada HTTP dentro del widget.
- Acompaña cada feature con su registro en el contenedor de DI.
- Mantén las entities y contratos idénticos en concepto entre ambos stacks.
