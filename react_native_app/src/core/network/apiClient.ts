import axios, { type AxiosInstance } from 'axios';

import { NetworkException, ServerException } from '../error/exceptions';

/**
 * Cliente HTTP base. Encapsula el acceso a la API REST (DummyJSON) y traduce
 * los problemas técnicos a `ServerException` / `NetworkException`.
 */
export class ApiClient {
  private readonly http: AxiosInstance;

  constructor(baseURL = 'https://dummyjson.com') {
    this.http = axios.create({
      baseURL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  get<T = unknown>(path: string): Promise<T> {
    return this.send(() => this.http.get<T>(path));
  }

  post<T = unknown>(path: string, body: unknown): Promise<T> {
    return this.send(() => this.http.post<T>(path, body));
  }

  put<T = unknown>(path: string, body: unknown): Promise<T> {
    return this.send(() => this.http.put<T>(path, body));
  }

  delete<T = unknown>(path: string): Promise<T> {
    return this.send(() => this.http.delete<T>(path));
  }

  private async send<T>(request: () => Promise<{ data: T }>): Promise<T> {
    try {
      const response = await request();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Hay respuesta del servidor con código de error (4xx/5xx).
        if (error.response) {
          throw new ServerException(`HTTP ${error.response.status}`);
        }
        // No hubo respuesta: timeout, DNS, sin conexión.
        throw new NetworkException();
      }
      throw new ServerException();
    }
  }
}
