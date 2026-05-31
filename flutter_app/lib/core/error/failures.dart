/// Fallos de dominio. La capa `data` traduce las excepciones técnicas
/// (`ServerException`, `NetworkException`) a estos fallos, y la capa
/// `presentation` los muestra como mensajes claros al usuario.
sealed class Failure implements Exception {
  final String message;
  const Failure(this.message);

  @override
  String toString() => message;
}

class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Ocurrió un error en el servidor.']);
}

class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'Sin conexión. Revisa tu red e intenta de nuevo.']);
}
