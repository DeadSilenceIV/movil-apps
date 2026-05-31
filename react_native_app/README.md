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
    theme/          # tema centralizado (design system) — implementado
    error/          # Failure types (cards posteriores)
    network/        # cliente HTTP base (cards posteriores)
    usecase/        # tipo UseCase base (cards posteriores)
  features/items/   # domain / data / presentation (cards posteriores)
  screens/          # WelcomeScreen inicial del scaffolding
  di/               # composición de dependencias (cards posteriores)
App.tsx             # raíz: ThemeProvider + pantalla inicial
```

## Tema / design system

Tema centralizado en `src/core/theme/` (única fuente de verdad: `docs/design-system.md`):

- **MD3** con los mismos hex que la app Flutter (semilla `#4F46E5`) en `tokens.ts`.
- `ThemeProvider` global que selecciona **claro/oscuro** según el sistema
  (`app.json` → `userInterfaceStyle: "automatic"`).
- Tokens de espaciado (escala 4/8 px), radios (tarjetas 16, controles 12) e iconografía
  `@expo/vector-icons` (vía Paper).

## Ejecutar

```bash
npm install
npx expo start
```

Abre la app en **Expo Go** (escanea el QR) o en un emulador Android (`a`).
