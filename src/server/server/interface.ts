import { KWMiddleware, Router } from '../router/interface';

export interface CreateServerParams {
  port: number;
  routes: Router;
  middlewares?: KWMiddleware[];
  onStartCb?: () => unknown;
  preStartCb?: () => unknown;
}
