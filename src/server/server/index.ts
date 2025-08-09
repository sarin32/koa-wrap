import { setupRouter } from '../router';
import { CreateServerParams } from './interface';
import * as Koa from 'koa';

export class Server {
  port: number;
  app: Koa<Koa.DefaultState, Koa.DefaultContext>;
  onstartCb: (() => unknown) | undefined;
  preStartCb: (() => unknown) | undefined;

  constructor({
    port,
    middlewares,
    onStartCb,
    preStartCb,
    routes,
  }: CreateServerParams) {
    this.app = new Koa();
    this.port = port;
    this.onstartCb = onStartCb;
    this.preStartCb = preStartCb;

    middlewares = middlewares || [];
    for (const middleware of middlewares) {
      this.app.use(middleware);
    }
    const router = setupRouter(routes);
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
  }

  async start() {
    await this.preStartCb?.();
    this.app.listen(this.port, this.onstartCb);
  }
}
