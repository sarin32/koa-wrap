import { KWMiddleware } from '../router/interface';

export interface ServerCreationParams {
  port: number;
  middlewares?: KWMiddleware[];
  onStartCb?: () => unknown;
  preStartCb?: () => unknown;
}
