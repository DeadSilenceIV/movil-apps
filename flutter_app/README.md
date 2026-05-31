# flutter_app

App en **Flutter** del proyecto de comparación. Gestión de productos (CRUD sobre la API
DummyJSON, estado en memoria) siguiendo **Clean Architecture** y el design system compartido
(`../docs/design-system.md`).

## Estructura (`lib/`)
```
lib/
  core/
    error/       failures.dart, exceptions.dart
    network/     api_client.dart
    theme/       app_theme.dart        # design system (seed #4F46E5, claro/oscuro)
    usecase/     usecase.dart
    router/      app_router.dart       # go_router
  features/productos/
    domain/      entities/ repositories/ usecases/
    data/        models/ datasources/ repositories/
    presentation/ state/ pages/ widgets/
  injection_container.dart             # get_it
  main.dart
```

- **Estado:** Provider (formal) + estado en memoria (RAM), sin persistencia local.
- **Navegación:** go_router (3 pantallas: Lista, Detalle, Formulario).
- **API:** `http` contra `https://dummyjson.com/products`.

## Ejecutar
```bash
flutter pub get
flutter run
```

## Build release
```bash
flutter build apk --release
```
