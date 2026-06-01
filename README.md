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

**Requisitos comunes:** un dispositivo Android (físico con depuración USB o emulador) y el SDK de
Android (`adb` en el PATH). Conexión a internet (la app consume la API DummyJSON).

### Flutter
**Requisitos:** Flutter SDK (Dart incluido) — verificar con `flutter doctor`.
```bash
cd flutter_app
flutter pub get          # instalar dependencias
flutter run              # ejecutar en el dispositivo/emulador conectado
flutter build apk --release   # (opcional) generar el APK Release
```

### React Native (Expo)
**Requisitos:** Node.js LTS + npm. Para el build nativo Release: JDK 17 y Android SDK/NDK.
```bash
cd react_native_app
npm install              # instalar dependencias
npx expo start           # ejecutar en modo desarrollo (Metro)
# Build nativo Release (reproduce las métricas):
npx expo prebuild --platform android   # generar el proyecto android/
cd android && ./gradlew assembleRelease
```
> **Nota (Windows):** el build nativo de RN (C++/CMake) **falla si la ruta del proyecto contiene
> espacios**; compílalo desde una ruta sin espacios (p. ej. `C:\rnapp`). Ver §4 y
> [`docs/comparativa-tamano-compilacion.md`](docs/comparativa-tamano-compilacion.md).

---

# Informe comparativo

Comparación objetiva de **Flutter** y **React Native (Expo)** implementando **la misma app** (CRUD
de productos + búsqueda, 3 pantallas, Clean Architecture, estado en RAM, misma API DummyJSON).
Todas las mediciones se tomaron en el **mismo equipo/dispositivo** y, donde aplica, en build
**Release**, para que la comparación sea justa. Cada métrica tiene su **metodología y evidencia
reproducible** documentada en `docs/`.

## Resumen de métricas

| Métrica                                   | Flutter      | React Native | Ventaja |
|-------------------------------------------|--------------|--------------|---------|
| **Tamaño APK** (release, universal) — §1  | **47.40 MB** | 63.28 MB     | **Flutter** (−15.88 MB, −33.5 %) |
| **Respuesta API** (avg, n=10) — §2        | 118.3 ms     | 118.9 ms     | Empate (dominado por la red) |
| **Fluidez** scroll/navegación — §3        | fluido (menor coste/frame) | fluido (jank leve) | **Flutter** (marginal; ambos a 60 fps+) |
| **Compilación** release limpia — §4       | **~110 s**   | ~785 s       | **Flutter** (~7.1×) |
| **Recarga en desarrollo** (percibida) — §4.1 | ~1.7 s    | **~0.34 s**  | **React Native** (~5×) |
| **Cold start** (avg, n=10) — §5           | 220.0 ms     | **141.8 ms** | **React Native** (~35 %) |

## Metodología
- **Equipo de medición:** Windows 11 (build 26200) — mismo portátil para ambos stacks.
- **Dispositivo/emulador:** emulador `Medium_Phone_API_36.1` (Android API 36, x86_64) para
  tamaño/compilación/recarga; teléfono físico `2506BPN68G` (Android 15, API 35) para respuesta de
  la API (§2), fluidez (§3) y cold start (§5), donde el **mismo dispositivo y red** importan —
  ambos stacks en el mismo equipo.
- **Tipo de build:** Release (tamaño, compilación, fluidez y cold start) · desarrollo/debug
  (recarga y respuesta API).
- **Nº de repeticiones por métrica:** recarga 1 warm-up + 5 medidas; respuesta API 2 warm-up +
  10 medidas; cold start 1 warm-up + 10 medidas (se reporta el promedio); fluidez gestos `adb`
  reproducibles (12 flings de scroll, 8 ciclos de navegación); tamaño/compilación: build limpio.
- **Evidencia detallada:** [`docs/comparativa-tamano-compilacion.md`](docs/comparativa-tamano-compilacion.md)
  (card 16), [`docs/comparativa-tiempo-respuesta-api.md`](docs/comparativa-tiempo-respuesta-api.md)
  (card 17), [`docs/comparativa-fluidez-fps.md`](docs/comparativa-fluidez-fps.md) (card 18),
  [`docs/comparativa-cold-start.md`](docs/comparativa-cold-start.md) (card 19) y los datos crudos en
  [`docs/flutter-build-metrics.md`](docs/flutter-build-metrics.md) /
  [`docs/react-native-build-metrics.md`](docs/react-native-build-metrics.md).

## 1. Tamaño del APK / AAB

| Métrica            | Flutter   | React Native | Observaciones |
|--------------------|-----------|--------------|---------------|
| Tamaño APK release | 47.40 MB  | 63.28 MB     | APK universal/fat; RN **+15.88 MB (+33.5 %)** por Hermes + runtime RN + bundle JS |
| Tamaño AAB         | _n/a_     | _n/a_        | No generado; ambos comparados como APK universal |

## 2. Tiempo de respuesta de la API

Tiempo desde el **inicio de la solicitud** hasta tener los **datos listos para renderizar**
(`GET /products?limit=30` → JSON → `List<Producto>`), la carga de la pantalla principal. Medido
en el **mismo teléfono físico y la misma red** para ambos stacks: 2 warm‑up + 10 medidas.
Detalle y evidencia: [`docs/comparativa-tiempo-respuesta-api.md`](docs/comparativa-tiempo-respuesta-api.md).

| Estadístico (n=10)  | Flutter         | React Native    | Observaciones |
|---------------------|-----------------|-----------------|---------------|
| **Promedio (avg)**  | **118.3 ms**    | **118.9 ms**    | Prácticamente iguales: RN **+0.6 ms (+0.5 %)**, dentro del ruido de red |
| Mediana             | ~97.2 ms        | ~112.5 ms       | Flutter algo más rápido por mediana/mínimo |
| Mínimo / Máximo     | 84.0 / 199.6 ms | 97.6 / 154.6 ms | Flutter mejor mínimo; RN mejor máximo |
| Desviación estándar | 38.5 ms         | 18.1 ms         | RN más consistente (menos varianza) |

**Lectura:** el tiempo de respuesta de la API está **dominado por la red**, no por la
plataforma. Ante el mismo endpoint y la misma red, Flutter y React Native rinden **igual en
promedio** (~118 ms); no hay diferencia significativa. El primer request (warm‑up, DNS+TLS:
Flutter 664 ms / RN 414 ms) se descarta. El pintado final en pantalla se evalúa en §3 (FPS).

## 3. Fluidez de la interfaz (FPS / jank)

Fluidez del **scroll de la lista** y de las **transiciones de navegación**, medida en el
**mismo teléfono físico** y en build **Release** para ambos stacks. La pantalla corre a **120 Hz**
(presupuesto de frame 8.33 ms; 16.67 ms a 60 Hz). No existe una herramienta única que lea los
dos motores (Flutter no usa HWUI), así que cada app se mide con su propio profiler: Flutter con
`addTimingsCallback`/`FrameTiming` (el dato del *Frames chart* de DevTools) y RN con
`dumpsys gfxinfo` (FrameMetrics, el dato del *Perf Monitor*). La comparación se ancla en las
métricas **relativas al presupuesto** (% de frames perdidos y % de jank). Detalle, gestos y
evidencia (datos crudos + capturas): [`docs/comparativa-fluidez-fps.md`](docs/comparativa-fluidez-fps.md).

| Interacción / métrica            | Flutter        | React Native   | Observaciones |
|----------------------------------|----------------|----------------|---------------|
| **Scroll** — tiempo medio/frame  | 2.51 ms        | 6.39 ms        | Flutter menor coste por frame; ambos muy holgados |
| **Scroll** — frames > 60 Hz (16.67 ms) | **0 %**  | **0 %**        | Ninguna pierde frames al hacer scroll |
| **Scroll** — jank (sistema)      | sin jank       | 0.19 % (2/1037)| Scroll esencialmente perfecto en ambos |
| **Navegación** — tiempo medio/frame | 4.77 ms     | 9.02 ms        | Transición más cara en ambos; RN medio sobre 8.33 ms |
| **Navegación** — frames > 60 Hz  | 0.6 % (5/890)  | 0.8 % (8/956)  | >99 % de frames dentro del presupuesto de 60 Hz |
| **Navegación** — jank (sistema)  | ~0.3 %         | 2.30 % (22/956)| Jank **leve y no sostenido**; Flutter tuvo 1 pico de 53 ms (1er build de Detalle) |

**Lectura:** en este dispositivo **ambas apps son fluidas a 60 fps o más**. En *scroll* las dos
son prácticamente perfectas (0 frames perdidos a 60 Hz). En *navegación* mantienen >99 % de los
frames dentro del presupuesto de 60 Hz; RN muestra algo más de jank durante la animación (2.30 %)
y Flutter un pico puntual al construir la pantalla por primera vez. Flutter tiene **menor tiempo
de producción de frame** (Skia + AOT); RN (Hermes + Fabric) se mantiene dentro del presupuesto
con un coste extra marginal. Para esta lista CRUD de 30 ítems, **la diferencia de fluidez es
pequeña y no perceptible para el usuario**.

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

Tiempo desde el *intent* de lanzamiento hasta que la app **—partiendo completamente cerrada—**
pinta su **primera pantalla funcional** (el evento `Displayed` del sistema = `TotalTime` de
`am start -W`, la métrica estándar **TTID**). Medido en el **mismo teléfono físico**, en build
**Release** y con `am force-stop` antes de cada medida (`LaunchState=COLD` confirmado): 1 warm-up +
10 medidas. La lista se rellena un instante después con la respuesta de la API (§2). Detalle y
evidencia: [`docs/comparativa-cold-start.md`](docs/comparativa-cold-start.md).

| Estadístico (n=10)  | Flutter      | React Native | Observaciones |
|---------------------|--------------|--------------|---------------|
| **Promedio (avg)**  | **220.0 ms** | **141.8 ms** | RN **~78 ms (~35 %) más rápido**; Hermes precompilado arranca antes que el runtime AOT + engine de Flutter |
| Mediana             | 221 ms       | 142.5 ms     | Misma tendencia por mediana |
| Mínimo / Máximo     | 194 / 243 ms | 133 / 154 ms | RN mejor en ambos extremos |
| Desviación estándar | 13.0 ms      | 6.8 ms       | RN más consistente (menos varianza) |
| `Displayed` (logcat)| +207 ms      | +138 ms      | Verificación cruzada del evento del sistema; corrobora los promedios |

**Lectura:** **React Native arranca en frío más rápido** (~141.8 ms vs ~220.0 ms) y de forma más
consistente; el evento `Displayed` del sistema corrobora el dato. La diferencia se debe al coste de
inicialización de cada plataforma: el bytecode **Hermes** (precompilado) se mapea y ejecuta muy
rápido, mientras que Flutter debe levantar su runtime AOT + engine y producir el primer frame con
Skia. Aun así **ambos arranques son rápidos** (<250 ms): los dos se perciben prácticamente
instantáneos y la ventaja de RN, aunque real, es **poco perceptible** en uso real.

## Análisis de la experiencia de desarrollo

Ambas apps se construyeron con **el mismo alcance** (mismas entidades, casos de uso, 3 pantallas y
Clean Architecture) y la **misma API**, por lo que las diferencias de experiencia provienen del
stack, no del problema.

- **Tiempos de desarrollo / iteración:** el factor que más se nota en el día a día es la **recarga
  en caliente**. RN (*Fast Refresh* ~0.34 s percibidos) es **~5× más rápido** que Flutter (*hot
  reload* ~1.7 s) — §4.1; sobre cientos de guardados al día, RN da un ciclo editar→ver más ágil. En
  sentido contrario, la **compilación limpia** de RN es **~7× más lenta** (~785 s vs ~110 s, §4)
  porque recompila C++ nativo (CMake/NDK) + Hermes; esto pesa en el primer build y en CI, no en el
  trabajo incremental. Además, RN presentó **fricción real de build**: su cadena C++/CMake/ninja
  **falla cuando la ruta del proyecto contiene espacios**, lo que obligó a compilar desde una copia
  sin espacios; Flutter compiló sin ese problema.
- **Curva de aprendizaje / herramientas:** **React Native** usa **JavaScript/TypeScript + React**,
  familiar para quien viene de web, con el ecosistema **npm** y **Expo** suavizando el arranque
  (Metro, EAS); el coste es una cadena con más piezas (Metro + Expo + Gradle + capa nativa).
  **Flutter** exige aprender **Dart** y el árbol de *widgets*, pero ofrece un **SDK más unificado y
  con baterías incluidas** (Material 3 de fábrica) y una **toolchain única** (`flutter` CLI +
  DevTools, *hot reload*), con menos integración manual entre herramientas.
- **Ventajas y desventajas por stack (según los datos medidos):**

  | Stack | Ventajas | Desventajas |
  |-------|----------|-------------|
  | **Flutter** | APK más pequeño (−33.5 %, §1); menor coste por frame y menos jank (§3); compilación limpia ~7× más rápida (§4); build nativo más simple (sin el problema de la ruta con espacios); toolchain unificada | *Hot reload* ~5× más lento (§4.1); cold start ~35 % más lento (§5); requiere aprender Dart |
  | **React Native** | *Fast Refresh* ~5× más rápido (§4.1); cold start ~35 % más rápido (§5); JS/TS + React + ecosistema npm familiar; DX de Expo | APK más grande (+33.5 %, §1); compilación limpia ~7× más lenta (§4); build nativo más pesado y frágil (C++/CMake/NDK + Hermes; falla con espacios en la ruta); algo más de jank en navegación (§3) |

  En **respuesta de API** (§2) no hay diferencia: ~118 ms en ambos, porque la domina la red, no la
  plataforma. En **fluidez** (§3) las dos rinden a **60 fps o más** y la diferencia es imperceptible
  para esta carga (lista CRUD de 30 ítems).

## Conclusión y recomendación

Para una app de este tamaño (CRUD + búsqueda, 3 pantallas, estado en RAM), **ambos stacks son
plenamente solventes**: igualan en respuesta de API, las dos son fluidas y las dos arrancan rápido
(<250 ms). Las diferencias medibles son acotadas y **se reparten**:

- **Flutter** gana en **tamaño de binario, coste por frame, tiempo de compilación y simplicidad del
  build nativo**, con una toolchain más unificada.
- **React Native** gana en **velocidad de iteración (Fast Refresh), cold start y familiaridad del
  ecosistema** (JS/TS + React + Expo/npm).

**Recomendación objetiva:** la elección depende de las prioridades del equipo, no de un ganador
absoluto de rendimiento (en uso real las diferencias son pequeñas y poco perceptibles).

- Si el equipo **ya domina JavaScript/React**, valora la **iteración rápida** y el **ecosistema
  npm/Expo**, y le importa el arranque instantáneo → **React Native**.
- Si se prioriza un **binario más liviano**, **menor coste de runtime/animación**, **builds limpios
  más rápidos y simples** y una **herramienta única e integrada** → **Flutter**, asumiendo la curva
  de Dart y un *hot reload* algo más lento.

Para **este** proyecto en concreto, donde el rendimiento percibido es equivalente, el criterio
decisivo es **las competencias del equipo y las restricciones de build/distribución** (tamaño del
APK y tiempos de compilación) más que el rendimiento en ejecución.

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
