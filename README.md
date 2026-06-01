# Comparación de Desarrollo Móvil: Flutter vs React Native

Proyecto académico que implementa **la misma aplicación móvil** (gestión de productos con
CRUD sobre una API REST y estado en memoria) en **dos tecnologías** —  Flutter y
React Native (Expo) — para medir y comparar su rendimiento y experiencia de desarrollo.

Toda la implementación sigue **Clean Architecture** (capas `domain` / `data` / `presentation`).
Ver la guía en [`.claude/skills/clean-architecture/SKILL.md`](.claude/skills/clean-architecture/SKILL.md).

## Estructura del repositorio

```
movil-apps/
├── flutter_app/          # App en Flutter (Clean Architecture)
├── react_native_app/     # App en React Native + Expo (Clean Architecture)
├── docs/
│   ├── 01-alcance-modelo-casos-uso.md
│   └── 02-api-rest.md
└── README.md             # Este archivo: informe comparativo
```

## Resumen funcional

- **Entidad:** `Producto` (id, title, description, price, category, stock, rating, thumbnail).
- **API REST:** [DummyJSON `/products`](https://dummyjson.com/docs/products) — ver `docs/02-api-rest.md`.
- **Estado:** en memoria (RAM), **sin persistencia local**.
- **CRUD** completo + búsqueda.
- **Navegación:** 3 pantallas (Lista, Detalle, Formulario crear/editar).
- **Gestión de estado:** patrón formal en cada stack.

## Cómo ejecutar

### Flutter
```bash
cd flutter_app
flutter pub get
flutter run
```

### React Native (Expo)
```bash
cd react_native_app
npm install
npx expo start
```

---

# Informe comparativo

> Plantilla a completar conforme avanzan las cards de métricas (16–19) y el informe (20).
> Todas las mediciones deben tomarse en el **mismo equipo/dispositivo** y en build **Release**
> para que la comparación sea justa.

## Metodología
- **Equipo de medición:** Windows 11 (build 26200) — mismo portátil para ambos stacks.
- **Dispositivo/emulador:** emulador `Medium_Phone_API_36.1` (Android API 36, x86_64).
- **Tipo de build:** Release (tamaño/compilación) · desarrollo/debug (recarga).
- **Nº de repeticiones por métrica:** recarga 1 warm-up + 5 medidas (se reporta el promedio);
  tamaño/compilación: build limpio.
- **Evidencia detallada:** [`docs/comparativa-tamano-compilacion.md`](docs/comparativa-tamano-compilacion.md)
  (card 16) y los datos crudos en [`docs/flutter-build-metrics.md`](docs/flutter-build-metrics.md) /
  [`docs/react-native-build-metrics.md`](docs/react-native-build-metrics.md).

## 1. Tamaño del APK / AAB

| Métrica            | Flutter   | React Native | Observaciones |
|--------------------|-----------|--------------|---------------|
| Tamaño APK release | 47.40 MB  | 63.28 MB     | APK universal/fat; RN **+15.88 MB (+33.5 %)** por Hermes + runtime RN + bundle JS |
| Tamaño AAB         | _n/a_     | _n/a_        | No generado; ambos comparados como APK universal |

## 2. Tiempo de respuesta de la API

| Operación        | Flutter | React Native | Observaciones |
|------------------|---------|--------------|---------------|
| GET lista        | _—_     | _—_          |               |
| GET detalle      | _—_     | _—_          |               |
| POST crear       | _—_     | _—_          |               |
| PUT actualizar   | _—_     | _—_          |               |
| DELETE eliminar  | _—_     | _—_          |               |

_(Promedio de ≥10 ejecuciones por operación.)_

## 3. Fluidez de la interfaz (FPS / jank)

| Métrica              | Flutter | React Native | Observaciones |
|----------------------|---------|--------------|---------------|
| FPS promedio (scroll)| _—_     | _—_          |               |
| Frames con jank      | _—_     | _—_          |               |

## 4. Tiempo de compilación

| Métrica                  | Flutter        | React Native      | Observaciones |
|--------------------------|----------------|-------------------|---------------|
| Build release (limpio)   | ~110 s (107.7) | ~785 s (13 m 05 s)| Gradle `assembleRelease`; RN **~7.1×** por recompilar C++ nativo (CMake/NDK) + Hermes |
| Build incremental        | _—_            | _—_               | Pendiente (segundo build sin cambios) |

### 4.1 Recarga en desarrollo (hot reload / fast refresh)

Medido en el mismo emulador (1 warm-up + 5 medidas). Detalle en
[`docs/comparativa-tamano-compilacion.md`](docs/comparativa-tamano-compilacion.md).

| Métrica de recarga                   | Flutter (hot reload) | React Native (fast refresh) | Observaciones |
|--------------------------------------|----------------------|-----------------------------|---------------|
| Recompilación/HMR (lado herramienta) | ~880 ms              | **132 ms**                  | Flutter: compile+reload+reassemble (daemon); RN: `update-start→update-done` de Metro |
| Percibido (guardar → listo)          | ~1717 ms (~1.2 s est.)| **~335 ms**                | RN **~5× más rápido**: Fast Refresh solo re-transforma el módulo editado |

## 5. Cold Start (arranque en frío)

| Métrica            | Flutter | React Native | Observaciones |
|--------------------|---------|--------------|---------------|
| Tiempo cold start  | _—_     | _—_          | App cerrada, build Release |

## Análisis de la experiencia de desarrollo

- **Tiempos de desarrollo:** _por completar_
- **Curva de aprendizaje / herramientas:** _por completar_
- **Ventajas y desventajas por stack:** _por completar_

## Conclusión y recomendación

_Conclusión objetiva por completar tras recoger las métricas._

---

## Convención de ramas y commits

### Ramas
- `main`: rama estable; solo recibe merges revisados.
- `develop`: integración del trabajo en curso (opcional según el flujo del grupo).
- `feature/<stack>-<descripcion>`: p. ej. `feature/flutter-crud-productos`,
  `feature/rn-navegacion`.
- `metrics/<nombre>`: ramas para la toma de métricas, p. ej. `metrics/cold-start`.

### Commits
Formato **obligatorio**: `[CU-<id de la card de ClickUp>]: <mensaje en imperativo>`

- El prefijo `[CU-<id>]` enlaza el commit con su card de ClickUp (p. ej. `[CU-86e1mqw3f]`).
- `<mensaje>`: descripción breve, en imperativo y en español.
- Ejemplos:
  - `[CU-86e1mqw3f]: inicializa proyecto Flutter con tema Material 3`
  - `[CU-86e1mqw49]: implementa CRUD en memoria con FlatList y tarjetas`
  - `[CU-86e1mqw55]: completa métrica de cold start en el informe`

> **El formato se valida automáticamente** con un hook `commit-msg` versionado en
> `.githooks/`. Actívalo una sola vez tras clonar el repo:
> ```bash
> git config core.hooksPath .githooks
> ```
> Cualquier commit cuyo asunto no empiece por `[CU-<id>]:` será **rechazado**.

### Flujo
1. Crear rama desde `main` (o `develop`).
2. Commits pequeños y descriptivos.
3. Pull Request hacia `main`/`develop` con al menos una revisión.
4. Merge tras aprobación.
