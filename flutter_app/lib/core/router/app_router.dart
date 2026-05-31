import 'package:go_router/go_router.dart';

import '../../features/productos/domain/entities/producto.dart';
import '../../features/productos/presentation/pages/producto_detail_page.dart';
import '../../features/productos/presentation/pages/producto_form_page.dart';
import '../../features/productos/presentation/pages/productos_list_page.dart';

/// Navegación formal de la app con go_router (3 pantallas: lista, detalle y
/// formulario de creación/edición).
final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const ProductosListPage(),
      routes: [
        GoRoute(
          path: 'detail/:id',
          builder: (context, state) => ProductoDetailPage(
            id: int.parse(state.pathParameters['id']!),
          ),
        ),
        GoRoute(
          path: 'form',
          builder: (context, state) => ProductoFormPage(
            producto: state.extra as Producto?,
          ),
        ),
      ],
    ),
  ],
);
