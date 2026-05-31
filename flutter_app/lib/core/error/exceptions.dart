/// Excepciones técnicas lanzadas por la capa `data` (datasources).
/// El repositorio las traduce a `Failure` de dominio.
class ServerException implements Exception {
  final String message;
  ServerException([this.message = 'Error del servidor']);
}

class NetworkException implements Exception {
  final String message;
  NetworkException([this.message = 'Error de red']);
}
