# Métrica — Tiempo de respuesta del consumo de la API (card 17)

Comparación **Flutter vs React Native** del tiempo que tarda cada app desde que **inicia la
solicitud** a la API REST hasta que **los datos quedan listos para renderizar** en pantalla.
Ambas mediciones se tomaron en el **mismo dispositivo físico, la misma red y contra el mismo
endpoint**, en condiciones equivalentes, para que la comparación sea justa.

## Qué se mide (definición de la ventana)

Operación medida: **`GET /products?limit=30`** — la carga de la lista de productos, que es la
pantalla principal y el dato que el usuario ve al abrir la app.

La ventana cronometrada es **inicio de la solicitud → datos parseados y entregados al estado
(listos para pintar)**, es decir todo el camino real del código de cada app:

```
petición HTTP  →  respuesta  →  decodificar JSON  →  mapear a List<Producto>  →  (listo para la UI)
```

Esto corresponde exactamente al método `getProductos()` del `RemoteDataSource` de cada stack
(mismo endpoint, mismo parsing, mismo mapeo a la entidad de dominio). El **pintado final de
píxeles** (primer frame en pantalla) depende del motor gráfico de cada plataforma y se evalúa
por separado en la métrica de fluidez/FPS (card 18); aquí se aísla el costo de *consumir la
API y tener los datos listos*, que es lo que define el "tiempo de respuesta".

## Entorno de medición (común a ambas plataformas)

- **Dispositivo:** teléfono físico **2506BPN68G** (`klimt`), **Android 15 (API 35)**, arm64 —
  **el mismo equipo para los dos stacks**.
- **Red:** misma red Wi‑Fi para ambas apps, misma franja horaria (mediciones consecutivas).
- **API:** DummyJSON `https://dummyjson.com/products?limit=30` (sin autenticación).
- **Modo de ejecución:** Flutter en *debug* (`flutter run`); React Native en *debug* sobre
  **Expo Go** conectado a Metro. Ambos JIT/dev — comparables entre sí.
- **Fecha:** 2026-05-31.

## Instrumentación

En cada app se añadió una instrumentación temporal que ejecuta el **mismo** camino de consumo
de la API (`ProductoRemoteDataSource.getProductos()`) en bucle: **2 iteraciones de warm‑up + 10
medidas**, cronometrando cada llamada con el reloj monotónico de la plataforma y reportando
`avg/min/max/std`. Se llama directamente al datasource remoto (no al repositorio) para que
**cada iteración golpee la red** y no la caché en memoria (RAM).

Flutter (`Stopwatch`, en `lib/main.dart`):

```dart
final remote = sl<ProductoRemoteDataSource>();
final sw = Stopwatch()..start();
await remote.getProductos();          // GET + JSON + map -> List<ProductoModel>
sw.stop();
final ms = sw.elapsedMicroseconds / 1000.0;
```

React Native (`performance.now()`, en `App.tsx`):

```ts
const remote = new ProductoRemoteDataSourceImpl(new ApiClient());
const t0 = performance.now();
await remote.getProductos();          // GET + JSON + map -> ProductoModel[]
const ms = performance.now() - t0;
```

> La primera llamada (warm‑up #0) incluye el costo de DNS + handshake TCP/TLS de la conexión
> nueva (Flutter 664 ms, RN 414 ms). Se descarta como warm‑up para que el promedio refleje el
> estado estable de la conexión, igual en ambas plataformas.

## Resultados (10 medidas por plataforma)

### Flutter

| #       | 1    | 2    | 3    | 4    | 5    | 6     | 7     | 8     | 9     | 10    |
|---------|------|------|------|------|------|-------|-------|-------|-------|-------|
| ms      | 84.0 | 90.3 | 92.1 | 92.6 | 95.5 | 98.8  | 123.6 | 148.8 | 157.4 | 199.6 |

`avg = 118.3 ms` · `mediana ≈ 97.2 ms` · `min = 84.0` · `max = 199.6` · `std = 38.5`

### React Native

| #       | 1    | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10    |
|---------|------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| ms      | 97.6 | 103.8 | 105.0 | 107.5 | 110.7 | 114.3 | 125.1 | 133.0 | 137.7 | 154.6 |

`avg = 118.9 ms` · `mediana ≈ 112.5 ms` · `min = 97.6` · `max = 154.6` · `std = 18.1`

## Comparación

| Métrica (GET /products → datos listos) | Flutter   | React Native | Diferencia              |
|----------------------------------------|-----------|--------------|-------------------------|
| Promedio (avg)                         | 118.3 ms  | 118.9 ms     | RN +0.6 ms (+0.5 %)     |
| Mediana                                | ~97.2 ms  | ~112.5 ms    | Flutter −15.3 ms        |
| Mínimo                                 | 84.0 ms   | 97.6 ms      | Flutter −13.6 ms        |
| Máximo                                 | 199.6 ms  | 154.6 ms     | RN −45.0 ms             |
| Desviación estándar                    | 38.5 ms   | 18.1 ms      | RN más consistente      |

**Lectura:**

- El **promedio es prácticamente idéntico** (118.3 vs 118.9 ms; ~0.5 % de diferencia, dentro
  del ruido de red). El tiempo de respuesta de la API está **dominado por la red**, no por la
  plataforma: ante el mismo endpoint y la misma red, Flutter y React Native rinden igual.
- Por **mediana y mínimo**, Flutter es ligeramente más rápido (~97 vs ~112 ms), pero tuvo más
  **varianza**: un par de llamadas lentas (148–199 ms) elevan su promedio hasta igualar a RN.
- React Native fue **más consistente** (std 18.1 vs 38.5 ms; máximo más bajo). La diferencia de
  varianza es atribuible a la red/scheduler en esas corridas, no a una ventaja estructural.
- Conclusión justa: en *tiempo de respuesta del consumo de la API* **no hay una diferencia
  significativa entre los dos stacks**; ambos quedan en el rango de ~100–120 ms de promedio.

## Reproducir la medición

1. Conectar el dispositivo por USB (`adb devices`) y la misma red Wi‑Fi.
2. Añadir la instrumentación temporal (bucle 2 warm‑up + 10) alrededor de
   `ProductoRemoteDataSource.getProductos()` en `lib/main.dart` (Flutter) y `App.tsx` (RN),
   imprimiendo `avg/min/max/std`.
3. Flutter: `flutter run -d <device>` y leer las líneas `APIBENCH` (tag `flutter` en logcat).
4. RN: `npx expo start`, `adb reverse tcp:8081 tcp:8081`, abrir la app en **Expo Go** y leer las
   líneas `APIBENCH` (tag `ReactNativeJS` en logcat / consola de Metro).
5. Revertir la instrumentación temporal al terminar (no queda en el código de la app).
