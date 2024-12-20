import { ServerCreationParams } from './interface';
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
  }: ServerCreationParams) {
    this.app = new Koa();
    this.onstartCb = onStartCb;
    this.port = port;
    this.preStartCb = preStartCb;

    middlewares = middlewares || [];
    for (const middleware of middlewares) {
      this.app.use(middleware);
    }
  }

  async start() {
    await this.preStartCb?.();
    this.app.listen(this.port, this.onstartCb);
  }
}
