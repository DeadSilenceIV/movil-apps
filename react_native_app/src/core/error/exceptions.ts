// Excepciones técnicas lanzadas por la capa `data` (datasources).
// El repositorio las traduce a `Failure` de dominio.

export class ServerException extends Error {
  constructor(message = 'Error del servidor') {
    super(message);
    this.name = 'ServerException';
  }
}

export class NetworkException extends Error {
  constructor(message = 'Error de red') {
    super(message);
    this.name = 'NetworkException';
  }
}
