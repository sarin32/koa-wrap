import type { Context, Next } from 'koa';

export type LoggerMetadata = {
  method: string;
  url: string;
  responseTime?: number;
  status?: number;
  length?: number;
};

export type HttpLoggerOptions = {
  ignoreCB?: (ctx: Context) => boolean;
  logger?: (msg: string, metadata?: LoggerMetadata) => unknown;
};

export function httpLogger({
  logger = console.log,
  ignoreCB,
}: HttpLoggerOptions = {}) {
  return async (ctx: Context, next: Next) => {
    if (ignoreCB?.(ctx)) {
      return next();
    }
    const start = Date.now();

    // incoming
    logger(`<-- ${ctx.method} ${ctx.originalUrl}`, {
      method: ctx.method,
      url: ctx.originalUrl,
    });

    try {
      await next();
    } finally {
      const ms = Date.now() - start;

      // outgoing
      logger(
        `--> ${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms ${ctx.length || 0}b`,
        {
          method: ctx.method,
          url: ctx.originalUrl,
          responseTime: ms,
          status: ctx.status,
          length: ctx.length,
        }
      );
    }
  };
}
