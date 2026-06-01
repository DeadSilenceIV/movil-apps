# Métrica — Fluidez de la interfaz: FPS / jank (card 18)

Comparación **Flutter vs React Native** de la **fluidez de la interfaz** en dos interacciones
clave: el **scroll de la lista larga** de productos y las **transiciones de navegación**
(Lista → Detalle → Lista). Ambas mediciones se tomaron en el **mismo dispositivo físico** y con
**builds Release** de las dos apps, para que la comparación sea justa.

## Qué se mide

La "fluidez" se mide como el **tiempo que tarda cada frame en producirse** frente al
**presupuesto del vsync** (el tiempo disponible entre dos refrescos de pantalla). Si un frame
se produce dentro del presupuesto, la animación va fluida; si lo excede, se pierde el frame y
el usuario percibe un *jank* (tirón). Por eso reportamos tres cosas por interacción:

- **Tiempo de producción de frame** (ms): mediana y percentiles p90/p95/p99 + máximo.
- **% de frames por encima del presupuesto** (8.33 ms a 120 Hz y 16.67 ms a 60 Hz).
- **% de frames con jank** (frames que el propio sistema marca como perdidos).

> **Nota sobre el "FPS":** en ambos motores el dato disponible es el **tiempo de trabajo por
> frame**, no el intervalo entre frames. Calcular `FPS = 1000 / tiempo_de_trabajo` no tiene
> sentido (daría cientos de "FPS" mientras la pantalla solo refresca a 120 Hz). La medida
> honesta de fluidez es **el tiempo de frame contra el presupuesto y el % de frames perdidos**,
> que es justo lo que se reporta aquí.

## Entorno de medición (común a ambas plataformas)

- **Dispositivo:** teléfono físico **2506BPN68G** (`klimt`), **Android 15 (API 35)**, arm64 —
  **el mismo equipo para los dos stacks**.
- **Pantalla:** 1280 × 2772, **120 Hz adaptativos** (modo activo verificado por
  `dumpsys display`: `renderFrameRate 120.0`; el panel soporta 60/90/120/144 Hz). Presupuesto
  de frame: **8.33 ms a 120 Hz** y **16.67 ms a 60 Hz**.
- **Tipo de build:** **Release** en ambas apps (Flutter AOT; React Native Hermes + Fabric).
- **Datos en pantalla:** la misma lista de **30 productos** (`GET /products?limit=30`), con
  miniaturas de red en cada tarjeta.
- **Fecha:** 2026-06-01.

## Por qué se usan dos herramientas de profiling distintas

En este dispositivo **no existe una única herramienta que lea los dos motores**:

- `dumpsys gfxinfo <paquete>` reporta **0 frames para Flutter**, porque Flutter **no usa el
  pipeline gráfico de Android (HWUI)**: dibuja con su propio motor (Skia/Impeller) sobre una
  `SurfaceView`. Las métricas de HWUI no ven sus frames.
- `dumpsys SurfaceFlinger --latency <capa>` devuelve **timestamps en cero** en Android 15 (la
  estructura *legacy* de latencia ya no se rellena), así que tampoco sirve como fuente común.

Por eso cada app se mide con **el profiler que su propia plataforma expone** (la misma fuente
de datos que usan sus herramientas oficiales):

| Plataforma   | Herramienta / fuente                         | Qué entrega                                   |
|--------------|----------------------------------------------|-----------------------------------------------|
| Flutter      | `SchedulerBinding.addTimingsCallback` → `FrameTiming.totalSpan` (build + raster) | Lo mismo que grafica el **Frames chart** de Flutter DevTools. |
| React Native | `dumpsys gfxinfo <pkg>` → histograma de FrameMetrics + `Janky frames` | Lo mismo que usa el **Perf Monitor** de RN / el GPU profiler de Android. |

Ambas miden conceptualmente lo mismo: **cuánto tarda cada frame en producirse frente al
presupuesto de vsync**. La comparación se ancla en las **métricas relativas al presupuesto**
(`% sobre 60 Hz` y `% de jank`), porque son robustas a la pequeña diferencia de alcance entre
las dos herramientas: `gfxinfo` abarca un poco más del pipeline (input + animación + layout +
GPU) que el `totalSpan` de Flutter (build + raster), de modo que sus milisegundos absolutos
salen algo más altos. Por eso **no sobre-interpretamos diferencias pequeñas de ms absolutos**.

## Protocolo de prueba (idéntico en ambas apps)

Gestos programáticos vía `adb` para que sean **reproducibles y equivalentes** en los dos stacks:

- **Scroll:** `dumpsys gfxinfo <pkg> reset` → **12 flings** (`input swipe 640 2100 640 700`,
  250 ms cada uno, con pausa de 300 ms) → leer contadores.
- **Navegación:** `reset` → **8 ciclos** de `input tap 640 1000` (abrir Detalle) + `keyevent 4`
  (volver) → leer contadores.

En Flutter, la instrumentación `addTimingsCallback` se añadió de forma **temporal** en
`lib/main.dart`, se ejecutó en Release y **se revirtió** al terminar (no queda en el código).

## Resultados — Scroll de la lista

| Métrica (por frame)        | Flutter (`totalSpan`) | React Native (`gfxinfo`) |
|----------------------------|-----------------------|--------------------------|
| Frames medidos             | 1210                  | 1037                     |
| Tiempo medio de frame      | **2.51 ms**           | **6.39 ms**              |
| Mediana (p50)              | 2.39 ms               | 5 ms                     |
| p90 / p95                  | 3.20 / 3.51 ms        | 8 / 8 ms                 |
| p99                        | 4.12 ms               | 9 ms                     |
| Máximo                     | 11.03 ms              | 11 ms                    |
| **Frames > 8.33 ms (120 Hz)** | **0.1 %** (1)      | **4.3 %** (45)           |
| **Frames > 16.67 ms (60 Hz)** | **0 %**            | **0 %**                  |
| Jank (sistema)             | sin jank              | **0.19 %** (2 frames)    |

**Lectura:** las dos apps hacen scroll de forma fluida. **Ninguna pierde un solo frame frente
al presupuesto de 60 Hz** (16.67 ms). Frente al presupuesto más exigente de 120 Hz, Flutter se
mantiene casi todo por debajo (0.1 % por encima) y React Native pesa un poco más (mediana 5 ms,
4.3 % por encima de 8.33 ms) pero sigue holgadamente dentro de 60 Hz y con solo 2 frames con
jank. El trabajo por frame de Flutter es menor en términos absolutos; RN también es fluido.

## Resultados — Transiciones de navegación

| Métrica (por frame)        | Flutter (`totalSpan`) | React Native (`gfxinfo`) |
|----------------------------|-----------------------|--------------------------|
| Frames medidos             | 890                   | 956                      |
| Tiempo medio de frame      | **4.77 ms**           | **9.02 ms**              |
| Mediana (p50)              | 4.37 ms               | 9 ms                     |
| p90 / p95                  | 6.17 / 7.09 ms        | 11 / 11 ms               |
| p99                        | 11.77 ms              | 15 ms                    |
| Máximo                     | 53.03 ms              | 27 ms                    |
| **Frames > 8.33 ms (120 Hz)** | **3.1 %** (28)     | **50.8 %** (486)         |
| **Frames > 16.67 ms (60 Hz)** | **0.6 %** (5)      | **0.8 %** (8)            |
| Frames > 25 ms             | 0.3 % (3)             | 0.1 % (1)                |
| Jank (sistema)             | ~0.3 % (zona)         | **2.30 %** (22 frames)   |

**Lectura:** las transiciones cuestan más en ambos stacks. En RN, la mediana de frame durante
la transición (9 ms) queda **medio por encima del presupuesto de 120 Hz** (50.8 % > 8.33 ms),
pero solo **0.8 % supera el de 60 Hz** y hay 22 frames con jank (2.30 %). En Flutter los frames
de transición son más ligeros (mediana 4.37 ms) pero apareció **un frame atípico de 53 ms** —
el coste *de una sola vez* de construir la pantalla de Detalle por primera vez—, que explica el
0.3 % > 25 ms. Ambas presentan transiciones suaves; **ninguna muestra jank sostenido**.

## Comparación y conclusión

| Criterio relativo al presupuesto      | Flutter          | React Native      |
|---------------------------------------|------------------|-------------------|
| Scroll — frames perdidos a 60 Hz      | 0 %              | 0 %               |
| Scroll — jank del sistema             | sin jank         | 0.19 %            |
| Navegación — frames perdidos a 60 Hz  | 0.6 %            | 0.8 %             |
| Navegación — jank del sistema         | ~0.3 %           | 2.30 %            |
| Tiempo de frame (absoluto)            | **menor**        | algo mayor        |

- En **scroll**, los dos stacks son **prácticamente perfectos a 60 Hz** (0 frames perdidos).
  Flutter rinde mejor incluso contra el listón de 120 Hz; RN se mantiene fluido con jank
  marginal (2 frames de 1037).
- En **navegación**, ambos mantienen las transiciones por debajo del presupuesto de 60 Hz en
  más del 99 % de los frames. RN tiene algo más de jank durante la animación (2.30 %), pero
  **no sostenido**; Flutter tiene un pico puntual al construir la pantalla por primera vez.
- **Aviso metodológico:** los milisegundos absolutos no son un 1:1 literal porque las dos
  herramientas miden ventanas algo distintas (gfxinfo abarca más del pipeline que el
  build+raster de Flutter). La comparación justa son las **métricas relativas al deadline**
  (`% > 60 Hz` y `% de jank`): por ellas, **ambos stacks son esencialmente libres de jank en
  scroll y solo presentan jank leve y no sostenido en las transiciones**.

**Conclusión:** en este dispositivo las dos apps renderizan la lista de productos y las
transiciones de pantalla de forma **fluida, a 60 fps o más**. Flutter muestra un **tiempo de
producción de frame menor** (pipeline Skia + AOT), mientras que React Native (Hermes + Fabric)
se mantiene dentro del presupuesto de 60 Hz con un coste extra marginal en las transiciones.
Para esta carga de trabajo (lista CRUD de 30 ítems), **la diferencia de fluidez es pequeña y no
resulta perceptible para el usuario**.

## Evidencia

Datos crudos y capturas en [`docs/evidencia-fps/`](evidencia-fps/):

- `flutter-scroll-frames.txt` / `flutter-nav-frames.txt` — tiempos de frame (`totalSpan`, ms) de
  Flutter Release (1210 y 890 frames).
- `rn-scroll-gfxinfo.txt` / `rn-nav-gfxinfo.txt` — volcados completos de `dumpsys gfxinfo` de RN
  Release (histograma + `Janky frames` + percentiles).
- `flutter-lista.png`, `flutter-detalle.png`, `rn-lista.png`, `rn-detalle.png` — capturas de
  ambas apps mostrando la misma lista y el mismo producto de Detalle (evidencia visual).

## Reproducir la medición

1. Conectar el dispositivo por USB (`adb devices`) e instalar los **APK Release** de ambas apps.
2. **React Native** (lectura directa, sin tocar código):
   - Abrir la app, `adb shell dumpsys gfxinfo <pkg> reset`.
   - Ejecutar los gestos (`input swipe` para scroll / `input tap` + `keyevent 4` para navegar).
   - `adb shell dumpsys gfxinfo <pkg>` y leer `Total frames`, `Janky frames`, percentiles e
     `HISTOGRAM`.
3. **Flutter** (instrumentación temporal):
   - En `lib/main.dart`, registrar `SchedulerBinding.instance.addTimingsCallback(...)` e imprimir
     `FrameTiming.totalSpan` por frame; compilar en **Release**.
   - Ejecutar los **mismos** gestos; capturar las líneas `FRAMEBENCH` de logcat.
   - **Revertir** la instrumentación al terminar.
4. Comparar usando **% de frames > 16.67 ms (60 Hz)** y **% de jank**, que son las métricas
   robustas frente a la diferencia de alcance de las dos herramientas.
