// Fallos de dominio. La capa `data` traduce las excepciones técnicas
// (`ServerException`, `NetworkException`) a estos fallos, y la capa
// `presentation` los muestra como mensajes claros al usuario.

export abstract class Failure extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ServerFailure extends Failure {
  constructor(message = 'Ocurrió un error en el servidor.') {
    super(message);
  }
}

export class NetworkFailure extends Failure {
  constructor(message = 'Sin conexión. Revisa tu red e intenta de nuevo.') {
    super(message);
  }
}
