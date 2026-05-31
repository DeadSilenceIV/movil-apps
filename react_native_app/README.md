# react_native_app

App en **React Native + Expo** del proyecto de comparación. Implementa la gestión de
productos (CRUD sobre la API DummyJSON, estado en memoria) siguiendo **Clean Architecture**.

> Carpeta reservada para el scaffolding (`create-expo-app`). Estructura objetivo de `src/`
> según la guía `.claude/skills/clean-architecture/SKILL.md`:

```
src/
  core/            # error, network, usecase base
  features/items/  # domain / data / presentation
  di/
  App.tsx
```

## Ejecutar
```bash
npm install
npx expo start
```
