/// Contrato base de un caso de uso (Clean Architecture).
/// [T] es el tipo de retorno; [P] el tipo de entrada (parámetros).
abstract interface class UseCase<T, P> {
  Future<T> call(P params);
}

/// Marcador para casos de uso que no reciben parámetros.
class NoParams {
  const NoParams();
}
