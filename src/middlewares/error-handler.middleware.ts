import { Context, Next } from 'koa';
import { BaseError } from '../errors';
import HttpStatusCode from '../http-codes';

export type ErrorMiddlewareOptions = {
  logger?: (ctx: Context, err: unknown) => unknown;
};

export function errorMiddleware({ logger }: ErrorMiddlewareOptions = {}) {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      if (logger) logger(ctx, error);
      else console.log(error);

      const body: Record<string, unknown> = {};
      if (error instanceof BaseError) {
        ctx.status = error.statusCode;
        body.message = error.message;
        if (error.errorCode) {
          body.errorCode = error.errorCode;
        }
      } else {
        ctx.status = HttpStatusCode.INTERNAL_SERVER_ERROR;
        body.message = 'Something went wrong';
      }
      ctx.body = body;
    }
  };
}
