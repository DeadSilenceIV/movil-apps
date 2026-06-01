# Métrica — Tamaño del artefacto, tiempo de compilación y recarga en desarrollo (card 16)

Comparación **Flutter vs React Native** del tamaño del artefacto Release, el tiempo de
compilación y los tiempos de recarga durante el desarrollo (hot reload vs fast refresh).
Todas las mediciones se tomaron en el **mismo equipo y el mismo emulador**, en condiciones
equivalentes, para que la comparación sea justa.

Fuentes de datos crudos: [`flutter-build-metrics.md`](flutter-build-metrics.md) (card 09) y
[`react-native-build-metrics.md`](react-native-build-metrics.md) (card 15). Los tiempos de
recarga se midieron en esta card (16).

## Entorno de medición (común a ambas plataformas)

- **Equipo:** Windows 11 (build 26200) — mismo portátil para los dos stacks.
- **Emulador:** `emulator-5554` · AVD `Medium_Phone_API_36.1` · Android API 36 (x86_64).
- **Tipo de build (tamaño/tiempo):** Release, APK **universal/fat** (todas las ABIs, sin split)
  en ambos, para que el artefacto sea comparable.
- **Tipo de build (recarga):** modo desarrollo (debug) — Flutter `flutter run`,
  React Native vía **Expo Go** conectado a Metro.
- **Fecha:** 2026-05-31.

> Nota: ningún build generó **AAB** en esta comparación; ambos se compararon como **APK
> universal**. Los perfiles de release de cada proyecto pueden producir AAB (Flutter
> `flutter build appbundle`, RN `eas build --profile production`), pero para una comparación
> directa de bytes se usó el mismo formato (APK fat) en los dos.

## 1. Tamaño del artefacto Release (APK universal)

| Plataforma    | Tamaño APK            | Bytes        |
|---------------|-----------------------|--------------|
| Flutter       | **47.40 MB**          | 49 706 090   |
| React Native  | **63.28 MB**          | 66 353 076   |
| **Diferencia**| **+15.88 MB**         | +16 646 986  |

- React Native es **+33.5 % más grande** que Flutter (×1.34).
- Causa principal: el APK de RN empaqueta el **motor Hermes** + el runtime de React Native +
  el bundle JS (Hermes bytecode), mientras que Flutter incluye su engine pero aplica
  *tree-shaking* agresivo de iconos y código Dart AOT compacto.

## 2. Tiempo de compilación Release (build limpio)

| Plataforma    | Build Release limpio        | Tarea                          |
|---------------|-----------------------------|--------------------------------|
| Flutter       | **~110 s** (107.7 s)        | Gradle `assembleRelease`       |
| React Native  | **~785 s** (13 m 05 s)      | Gradle `assembleRelease` (CNG) |
| **Diferencia**| **+675 s** (~7.1× más lento)| RN +614 %                      |

- El build limpio de RN es **~7× más lento** que el de Flutter en este equipo.
- Causa principal: RN recompila el **C++ nativo** (CMake/ninja, NDK) de React Native y Hermes
  desde cero en el primer build; Flutter no recompila su engine (viene precompilado).
- Recordatorio reproducibilidad: el build nativo C++ de RN **falla si la ruta tiene espacios**;
  se compiló desde una copia en `C:\rnbuild2`. Detalle en `react-native-build-metrics.md`.

## 3. Recarga en desarrollo (hot reload vs fast refresh)

Medición con un *script* que dispara el ciclo de recarga y lo cronometra (1 warm-up + 5
medidos), editando un archivo real de la pantalla de lista en cada iteración.

### Flutter — hot reload (vía daemon `flutter run --machine`)

Tiempo de ida y vuelta del daemon (recompila Dart + recarga + *reassemble* + primer frame):

| #    | 1     | 2     | 3     | 4     | 5     | **Promedio** |
|------|-------|-------|-------|-------|-------|--------------|
| ms   | 2482  | 1453  | 2257  | 1196  | 1195  | **1717 ms**  |

- En estado estable (reloads 4–5) ronda **~1.2 s**.
- Desglose que reporta Flutter (último reload): `compile 33 ms · reload 372 ms · reassemble 475 ms`.

### React Native — fast refresh (vía WebSocket HMR `/hot` de Metro)

`update-start → update-done` = tiempo que tarda Metro en recomputar y empujar el *delta* HMR
del módulo editado; *wall* = desde guardar el archivo hasta que el delta está listo:

| #              | 1    | 2    | 3    | 4    | 5    | **Promedio** |
|----------------|------|------|------|------|------|--------------|
| HMR Metro (ms) | 163  | 129  | 125  | 124  | 120  | **132 ms**   |
| Wall (ms)      | 355  | 333  | 316  | 347  | 321  | **335 ms**   |

- Fast Refresh solo **re-transforma el módulo cambiado** y envía un delta pequeño; por eso es
  mucho más rápido que el hot reload de Flutter, que recompila y reensambla el árbol de widgets.

### Comparación de recarga

| Métrica de recarga                  | Flutter        | React Native   |
|-------------------------------------|----------------|----------------|
| Recompilación/HMR (lado herramienta)| ~880 ms*       | **132 ms**     |
| Percibido (guardar → listo)         | ~1717 ms       | **~335 ms**    |

\* Flutter: `compile + reload + reassemble` reportado por el daemon (~0.8–1.0 s en estado estable).

- React Native recarga **~5× más rápido** (percibido) en este escenario. El número de Flutter
  incluye el *reassemble* + frame en el dispositivo; el de RN (HMR) es el costo en Metro y el
  *re-render* en el dispositivo añade una fracción pequeña. Aun comparando *wall* contra *wall*,
  Fast Refresh es claramente más veloz para una edición de un solo archivo.

## 4. Resumen comparativo

| Métrica                          | Flutter   | React Native | Diferencia                  |
|----------------------------------|-----------|--------------|-----------------------------|
| Tamaño APK Release (universal)   | 47.40 MB  | 63.28 MB     | RN +15.88 MB (+33.5 %)      |
| Build Release limpio             | ~110 s    | ~785 s       | RN +675 s (~7.1×)           |
| Recarga en desarrollo (percibido)| ~1.7 s    | ~0.34 s      | RN ~5× más rápido           |

**Lectura:** Flutter gana en **tamaño del artefacto** y **tiempo de compilación**; React Native
gana de forma marcada en **velocidad de recarga durante el desarrollo** (Fast Refresh). Ambas
se midieron en el mismo equipo/emulador y en build Release (tamaño/tiempo) o desarrollo
(recarga), en condiciones equivalentes.

## Reproducir las mediciones

- **Tamaño:** `flutter build apk --release` y, para RN, `npx expo prebuild -p android` +
  `cd android && ./gradlew assembleRelease`; medir bytes del `app-release.apk`.
- **Tiempo:** registrar la duración de la tarea Gradle `assembleRelease` (build limpio).
- **Hot reload (Flutter):** `flutter run --machine`, disparar `app.restart`
  (`fullRestart:false`) tras editar un archivo y cronometrar la respuesta del daemon.
- **Fast Refresh (RN):** con Metro corriendo y Expo Go conectado, conectarse al WebSocket
  `ws://localhost:8081/hot`, registrar el *entrypoint* del bundle y cronometrar
  `update-start → update-done` al editar un archivo.
