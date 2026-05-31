// Contrato base de un caso de uso (Clean Architecture).
// `T` es el tipo de retorno; `P` el tipo de entrada (parámetros).
export interface UseCase<T, P> {
  call(params: P): Promise<T>;
}

/** Marcador para casos de uso que no reciben parámetros. */
export type NoParams = void;
