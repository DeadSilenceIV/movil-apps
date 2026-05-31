# flutter_app

App en **Flutter** del proyecto de comparación. Implementa la gestión de productos (CRUD
sobre la API DummyJSON, estado en memoria) siguiendo **Clean Architecture**.

> Carpeta reservada para el scaffolding (`flutter create`). Estructura objetivo de `lib/`
> según la guía `.claude/skills/clean-architecture/SKILL.md`:

```
lib/
  core/            # error, network, usecase base
  features/items/  # domain / data / presentation
  injection_container.dart
  main.dart
```

## Ejecutar
```bash
flutter pub get
flutter run
```
