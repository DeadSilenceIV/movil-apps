# React Native — Métricas de build Release (card 15)

Datos crudos del build de producción de la app React Native + Expo, para alimentar las
cards de métricas 16 (tamaño/compilación) y 19 (cold start). Mismo equipo y misma fecha
que el build de Flutter (`flutter-build-metrics.md`) para una comparación justa.

## Comando
```bash
# Generación del proyecto nativo (Expo prebuild / CNG)
npx expo prebuild --platform android

# Build Release (equivalente a `expo run:android --variant release`)
cd android && ./gradlew assembleRelease
```

## Resultado (medido el 2026-05-31)

| Métrica                     | Valor                                                          |
|-----------------------------|----------------------------------------------------------------|
| Artefacto                   | `android/app/build/outputs/apk/release/app-release.apk`        |
| **Tamaño APK release**      | **63.28 MB** (66 353 076 bytes)                                |
| **Tiempo de compilación**   | **~785 s / 13 m 05 s** (tarea Gradle `assembleRelease`, build limpio) |
| Estado                      | ✓ build sin errores; APK instalable                            |
| Tipo de APK                 | Universal / *fat* (todas las ABIs, sin *split*) — comparable al `app-release.apk` de Flutter |
| applicationId               | `com.movilapps.productos_rn` (distinto del Flutter `com.movilapps.productos_app` para coexistir en el dispositivo) |
| versionName / versionCode   | `1.0.0` / `1`                                                  |
| Motor JS                    | Hermes (bytecode precompilado en `index.android.bundle`)       |

> Copia del artefacto disponible en `react_native_app/dist/productos-rn-release.apk`.

## Entorno de medición
- Expo SDK 54.0.x · React Native 0.81.5 · React 19.1.0
- Gradle 8.14.3 · Android Gradle Plugin (AGP) 8.x · JDK 21 (Android Studio JBR)
- Android SDK: build-tools 36.0.0 · compileSdk/targetSdk 36 · minSdk 24 · NDK 27.1.12297006
- Windows 11 (build 26200) — **mismo equipo** que el build de Flutter.
- Build limpio (primera compilación release; los `.cxx` de CMake se regeneraron desde cero).

## Notas importantes (reproducir el build)
- **La ruta no puede contener espacios.** El build nativo C++ (CMake/ninja) de React Native
  falla con `ninja: error: manifest 'build.ninja' still dirty after 100 tries` cuando la ruta
  del proyecto tiene espacios. La ruta real (`...\Octavo Semestre\...`) los tiene, así que el
  build se ejecutó desde una **copia en `C:\rnbuild2`** (sin espacios). Flutter sí tolera
  espacios; React Native no.
- `android/local.properties` debe usar barras normales o backslashes escapados
  (`sdk.dir=C:/Users/.../Android/Sdk`). Un `\U`, `\L`, etc. sin escapar corrompe la ruta del
  SDK y produce `Invalid file path`.
- **Instalación en dispositivo real (pendiente de equipo conectado):**
  ```bash
  adb install -r react_native_app/dist/productos-rn-release.apk
  ```
  No había dispositivo conectado por adb al momento del build; el teléfono usa Expo Go sin
  depuración USB. El APK queda listo para instalar y ejecutar.

## Comparación rápida (mismo equipo, build Release universal)

| App           | Tamaño APK            | Tiempo build limpio | Recarga dev (percibido) |
|---------------|-----------------------|---------------------|-------------------------|
| Flutter       | 47.40 MB              | ~110 s              | ~1.7 s (hot reload)     |
| React Native  | 63.28 MB              | ~785 s (13 m 05 s)  | ~0.34 s (fast refresh)  |

> **Comparación consolidada de la card 16** (tamaño, compilación y recarga, con diferencias en
> MB/% y evidencia): [`comparativa-tamano-compilacion.md`](comparativa-tamano-compilacion.md).
>
> Para la card 19 (cold start): repetir en el mismo equipo, promediar varias corridas y
> registrar también el build incremental (segunda compilación sin cambios), más rápido que el
> build limpio aquí medido.
