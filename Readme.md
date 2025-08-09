# @webexdx/koa-wrap

A wrapper package around the [Koa](https://koajs.com/) framework, providing a structured approach to building Koa servers with middleware, error handling, and routing utilities.

## Features

- **Typed Routing**: Define routes and groups with TypeScript types.
- **Middleware Support**: Easily add global and route-specific middleware.
- **JWT Authentication Middleware**: Plug-and-play authentication using JSON Web Tokens.
- **Centralized Error Handling**: Standard error responses for API consumers.
- **HTTP Status Codes**: Enum for all standard HTTP status codes.

## Installation

```sh
npm install @webexdx/koa-wrap
```

## Usage

### 1. Define Routes

```ts
import { HTTPMethod, RouteHandler, Router } from '@webexdx/koa-wrap';

const routes: Router = [
  {
    path: '/api',
    children: [
      {
        path: '/hello',
        method: HTTPMethod.GET,
        handler: async (ctx) => {
          ctx.body = { message: 'Hello, world!' };
        },
      },
    ],
  },
];
```

### 2. Create and Start the Server

```ts
import { Server } from '@webexdx/koa-wrap';
import { errorMiddleware } from '@webexdx/koa-wrap/middlewares';

const server = new Server({
  port: 3000,
  routes,
  middlewares: [errorMiddleware],
  onStartCb: () => {
    console.log('Server started on port 3000');
  },
});

server.start();
```

### 3. JWT Authentication Middleware

```ts
import { authMiddleware } from '@webexdx/koa-wrap/middlewares';

const jwtMiddleware = authMiddleware({
  secret: 'your_jwt_secret',
  payloadTransform: payload => ({ id: payload.sub }),
});
```

## API

### Server

See [`Server`](src/server/server/index.ts) for constructor options.

### Middleware

- [`authMiddleware`](src/middlewares/auth.middleware.ts): JWT authentication.
- [`errorMiddleware`](src/middlewares/error-handler.middleware.ts): Error handling.

### Errors

Custom error classes:
- [`BaseError`](src/errors/index.ts)
- [`BadRequestError`](src/errors/index.ts)
- [`AuthorizationError`](src/errors/index.ts)
- [`ConflictError`](src/errors/index.ts)
- [`ForbiddenError`](src/errors/index.ts)

### HTTP Status Codes

See [`HttpStatusCode`](src/http-codes/index.ts) for all available codes.

## Development

- Build: `npm run build`
- Lint: `npm run lint`
- Format: Prettier and ESLint are enforced.
- Tests: (Add your tests in `test/` and run with your preferred runner.)

## License

ISC

---

© Sarin Alexander