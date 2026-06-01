# Métrica — Tiempo de arranque (Cold Start) (card 19)

Comparación **Flutter vs React Native** del **tiempo de arranque en frío** (*cold start*): cuánto
tarda la app, **partiendo completamente cerrada**, en pintar su **primera pantalla funcional**.
Ambas mediciones se tomaron en el **mismo dispositivo físico** y con **builds Release**, para que
la comparación sea justa.

## Qué se mide

El *cold start* es el escenario más lento de inicio: el proceso de la app **no existe** en memoria,
así que el sistema debe crearlo desde cero (fork del proceso, carga de las librerías nativas,
arranque del runtime —Dart AOT en Flutter; Hermes en RN— e inflado/render del primer frame de la
UI). Se mide el tiempo desde que el sistema recibe el *intent* de lanzamiento hasta que la
actividad **pinta su primer frame con contenido** (el evento **`Displayed`** que registra Android,
equivalente al **TotalTime** que devuelve `am start -W`). Es la métrica estándar de **TTID**
(*Time To Initial Display*) y es **reproducible** porque la reporta el propio sistema.

> **Alcance — "primera pantalla funcional":** el `Displayed`/TotalTime corresponde al primer frame
> renderizado de la pantalla de Lista (su *scaffold* ya visible). La **lista de productos se
> rellena un instante después**, cuando responde la API (≈118 ms de media; ver
> [`comparativa-tiempo-respuesta-api.md`](comparativa-tiempo-respuesta-api.md), §2). El cold start
> mide el coste de **arrancar la plataforma y pintar la UI**, no la latencia de red, que se evalúa
> por separado.

## Entorno de medición (común a ambas plataformas)

- **Dispositivo:** teléfono físico **2506BPN68G** (`klimt`), **Android 15 (API 35)**, arm64 —
  **el mismo equipo para los dos stacks**.
- **Tipo de build:** **Release** instalado en el dispositivo (verificado `flags=0x0`, sin el bit
  *debuggable*). Flutter: Dart AOT. React Native: Hermes + Fabric.
- **Estado inicial:** app **completamente cerrada** antes de cada medida (`am force-stop`), de modo
  que cada lanzamiento sea realmente en frío (**`LaunchState=COLD`** confirmado en las 11
  ejecuciones de cada app, no relanzamiento *warm/hot*).
- **Paquetes:** Flutter `com.movilapps.productos_app/.MainActivity`;
  RN `com.movilapps.productos_rn/.MainActivity`.
- **Fecha:** 2026-06-01.

## Protocolo de prueba (idéntico en ambas apps)

Lanzamiento medido por el propio sistema, sin tocar el código de ninguna app:

1. `adb shell am force-stop <pkg>` — matar el proceso (garantiza arranque en frío).
2. Esperar ~2 s a que el sistema se estabilice.
3. `adb shell am start -W -n <pkg>/.MainActivity` — lanzar y leer **`TotalTime`** (ms) y
   `LaunchState`.
4. Repetir: **1 warm-up (descartado) + 10 medidas**; se reporta el **promedio**.
5. **Verificación cruzada:** en una ejecución aparte se lee el evento
   `ActivityTaskManager: Displayed … +Nms` de `logcat`, que es la misma fuente que alimenta el
   TotalTime.

Ningún paso modifica las apps: ambas se miden con la instrumentación que Android expone de fábrica.

## Resultados

| Estadístico (n=10)        | Flutter        | React Native   |
|---------------------------|----------------|----------------|
| **Promedio (avg)**        | **220.0 ms**   | **141.8 ms**   |
| Mediana                   | 221 ms         | 142.5 ms       |
| Mínimo / Máximo           | 194 / 243 ms   | 133 / 154 ms   |
| Desviación estándar       | 13.0 ms        | 6.8 ms         |
| `Displayed` (logcat, cruzado) | +207 ms    | +138 ms        |
| `LaunchState`             | COLD (11/11)   | COLD (11/11)   |

**Lectura:** en este dispositivo **React Native arranca en frío más rápido que Flutter**:
**141.8 ms vs 220.0 ms**, es decir RN es **~78 ms (~35 %) más rápido** y además **más consistente**
(desv. est. 6.8 vs 13.0 ms). La verificación con el evento `Displayed` del sistema corrobora los
promedios (RN +138 ms, Flutter +207 ms), así que el resultado no es un artefacto de la herramienta.
La diferencia se explica por el coste de inicialización de cada plataforma: el motor de Flutter
debe cargar su runtime y librería nativa AOT y producir el primer frame con su propio pipeline
(Skia), mientras que el bytecode **Hermes** de RN —precompilado— se mapea y ejecuta muy rápido para
una app pequeña, y el primer render llega antes. **Aun así, ambos arranques son rápidos**: por
debajo de ~250 ms los dos se perciben como instantáneos (muy lejos del umbral de ~1 s en el que el
usuario empieza a notar espera). En términos absolutos la diferencia (~78 ms) es **medible pero
apenas perceptible** en uso real.

## Conclusión

- **React Native gana en cold start** en este equipo: **~141.8 ms** frente a **~220.0 ms** de
  Flutter (~35 % más rápido) y con menor varianza.
- **Ambos son arranques rápidos** (<250 ms) y se sienten instantáneos; la ventaja de RN es real
  pero pequeña en la práctica.
- Es coherente con las demás métricas: RN paga su ventaja de arranque/recarga con un **APK más
  grande** (§1) y una **compilación mucho más lenta** (§4); Flutter es más liviano en disco y más
  barato por frame (§3) pero arranca algo más lento.

## Evidencia

Datos crudos en [`docs/evidencia-cold-start/`](evidencia-cold-start/):

- `flutter-coldstart.txt` — 10 medidas de `TotalTime` + estadísticos + línea `Displayed` de Flutter
  Release (todas `LaunchState=COLD`).
- `rn-coldstart.txt` — lo mismo para React Native Release.

Las capturas de la primera pantalla (Lista) de ambas apps están en
[`docs/evidencia-fps/`](evidencia-fps/) (`flutter-lista.png`, `rn-lista.png`).

## Reproducir la medición

1. Instalar los **APK Release** de ambas apps y conectar el dispositivo (`adb devices`).
2. Confirmar que el build es Release: `adb shell dumpsys package <pkg> | findstr flags=` debe
   mostrar `flags=0x0` (sin *debuggable*).
3. Para cada app, repetir 1 warm-up + 10 veces:
   - `adb shell am force-stop <pkg>`
   - `adb shell am start -W -n <pkg>/.MainActivity`
   - anotar `TotalTime` y comprobar `LaunchState: COLD`.
4. Promediar las 10 medidas (descartando el warm-up). Verificación opcional:
   `adb logcat -c` antes de lanzar y leer la línea `ActivityTaskManager: Displayed <pkg> … +Nms`.
