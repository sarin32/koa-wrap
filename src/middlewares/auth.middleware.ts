import { Context, Next } from 'koa';
import { AuthorizationError, BadRequestError } from '../errors';
import * as jwt from 'jsonwebtoken';
import { JwtPayload, Secret } from 'jsonwebtoken';

export interface TokenConfig<PayloadT = JwtPayload> {
  secret: Secret;
  payloadTransform?: (payload: JwtPayload) => PayloadT;
}

async function validateSignature(token: string, secret: Secret) {
  try {
    const payload = await jwt.verify(token, secret);
    return { payload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { tokenExpired: true };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { invalidToken: true };
    }
    throw error;
  }
}

export function authMiddleware(tokenConfig: TokenConfig) {
  return async (ctx: Context, next: Next) => {
    const authToken = ctx.get('Authorization');
    if (!authToken)
      throw new BadRequestError('Authorization header is not found');

    const token = authToken.split(' ').at(1);
    if (!token) throw new BadRequestError('Authorization header is invalid');

    const { invalidToken, payload, tokenExpired } = await validateSignature(
      token,
      tokenConfig.secret
    );

    if (tokenExpired) {
      throw new AuthorizationError('Authorization token expired');
    }

    if (invalidToken || !payload) {
      throw new AuthorizationError('Invalid Authorization token');
    }

    if (typeof payload === 'string') {
      throw new AuthorizationError('Invalid Authorization token payload');
    }

    ctx.state.user =
      tokenConfig.payloadTransform?.(payload) || (payload as JwtPayload);

    return await next();
  };
}
