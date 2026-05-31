# Flutter — Métricas de build Release (card 09)

Datos crudos del build de producción de la app Flutter, para alimentar las cards de
métricas 16 (tamaño/compilación) y 19 (cold start).

## Comando
```bash
flutter build apk --release
```

## Resultado (medido el 2026-05-31)

| Métrica                     | Valor                                            |
|-----------------------------|--------------------------------------------------|
| Artefacto                   | `build/app/outputs/flutter-apk/app-release.apk`  |
| **Tamaño APK release**      | **47.40 MB** (49 706 090 bytes)                  |
| **Tiempo de compilación**   | **~110 s** (tarea Gradle `assembleRelease`: 107.7 s) |
| Estado                      | ✓ build sin errores; APK instalable              |
| Tree-shaking de iconos      | MaterialIcons 1645 KB → 2.3 KB; CupertinoIcons 257 KB → 0.8 KB |

## Entorno de medición
- Flutter 3.41.7 (stable) · Dart 3.11.5 · Android SDK 36.1.0
- Windows 11 (build 26200), `flutter doctor` sin problemas bloqueantes.
- Build limpio (primera compilación release del proyecto).

> Notas para comparación justa (cards 16/19): repetir la medición en el **mismo equipo**
> que la app de React Native, en modo Release, y promediar varias corridas. El tiempo
> incremental (segundo build sin cambios) suele ser mucho menor que el build limpio.
