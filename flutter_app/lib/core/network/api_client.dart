import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../error/exceptions.dart';

/// Cliente HTTP base. Encapsula el acceso a la API REST (DummyJSON) y traduce
/// los problemas técnicos a [ServerException] / [NetworkException].
class ApiClient {
  final http.Client _client;
  final String baseUrl;

  ApiClient({http.Client? client, this.baseUrl = 'https://dummyjson.com'})
      : _client = client ?? http.Client();

  Future<dynamic> get(String path) => _send(() => _client.get(_uri(path)));

  Future<dynamic> post(String path, Map<String, dynamic> body) =>
      _send(() => _client.post(_uri(path), headers: _headers, body: jsonEncode(body)));

  Future<dynamic> put(String path, Map<String, dynamic> body) =>
      _send(() => _client.put(_uri(path), headers: _headers, body: jsonEncode(body)));

  Future<dynamic> delete(String path) => _send(() => _client.delete(_uri(path)));

  Uri _uri(String path) => Uri.parse('$baseUrl$path');

  Map<String, String> get _headers => const {'Content-Type': 'application/json'};

  Future<dynamic> _send(Future<http.Response> Function() request) async {
    try {
      final response = await request();
      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (response.body.isEmpty) return null;
        return jsonDecode(response.body);
      }
      throw ServerException('HTTP ${response.statusCode}');
    } on SocketException {
      throw NetworkException();
    } on HttpException {
      throw NetworkException();
    } on FormatException {
      throw ServerException('Respuesta inválida del servidor');
    }
  }
}
