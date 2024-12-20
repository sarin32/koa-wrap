import { GroupRoute, KWMiddleware, RouteHandler, Router } from './interface';
import * as KoaRouter from 'koa-router';

export function setupRouter(routes: Router) {
  const router = new KoaRouter();
  for (const route of routes) {
    let middlewares: KWMiddleware[] = [];
    if (Array.isArray(route.middlewares)) middlewares = route.middlewares;
    else if (route.middlewares) middlewares = [route.middlewares];
    router.use(route.path, ...middlewares);

    if (isGroupRoute(route)) {
      const childRouter = setupRouter(route.children);
      router.use(childRouter.routes(), childRouter.allowedMethods());
    }

    if (isHandlerRoute(route)) {
      router.use(route.handler);
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
