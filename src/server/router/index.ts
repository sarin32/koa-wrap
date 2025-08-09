import {
  GroupRoute,
  HTTPMethod,
  KWMiddleware,
  RouteHandler,
  Router,
} from './interface';
import * as KoaRouter from 'koa-router';

export function setupRouter(routes: Router) {
  const router = new KoaRouter();
  for (const route of routes) {
    let middlewares: KWMiddleware[] = [];
    if (Array.isArray(route.middlewares)) middlewares = route.middlewares;
    else if (route.middlewares) middlewares = [route.middlewares];

    if (isGroupRoute(route)) {
      const childRouter = setupRouter(route.children);
      router.use(
        route.path,
        ...middlewares,
        childRouter.routes(),
        childRouter.allowedMethods()
      );
    }

    if (isHandlerRoute(route)) {
      switch (route.method) {
        case HTTPMethod.GET:
          router.get(route.path, ...middlewares, route.handler);
          break;

        case HTTPMethod.POST:
          router.post(route.path, ...middlewares, route.handler);
          break;

        case HTTPMethod.PUT:
          router.put(route.path, ...middlewares, route.handler);
          break;

        case HTTPMethod.DELETE:
          router.delete(route.path, ...middlewares, route.handler);
          break;

        case HTTPMethod.PATCH:
          router.patch(route.path, ...middlewares, route.handler);
          break;

        case HTTPMethod.OPTIONS:
          router.options(route.path, ...middlewares, route.handler);
          break;

        case HTTPMethod.HEAD:
          router.head(route.path, ...middlewares, route.handler);
          break;

        default:
          console.warn(
            `Method ${route.method} not supported for path: ${route.path}`
          );
          break;
      }
    }
  }
  return router;
}

function isGroupRoute(router: GroupRoute | RouteHandler): router is GroupRoute {
  if ((router as GroupRoute).children) return true;
  return false;
}

function isHandlerRoute(
  router: GroupRoute | RouteHandler
): router is RouteHandler {
  if ((router as RouteHandler).handler) return true;
  return false;
}
