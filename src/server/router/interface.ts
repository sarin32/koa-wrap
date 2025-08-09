import { Middleware } from 'koa';
export type KWMiddleware = Middleware;

// Represents the structure of a single route
export interface GroupRoute {
  path: string; // Path for the route
  middlewares?: KWMiddleware | KWMiddleware[]; // Array of middleware functions for this route
  children: Router; // Nested child routes or individual routes with handlers
}

// A special case for routes that have handlers instead of children routes
export interface RouteHandler {
  path: string; // Path for the route
  handler: KWMiddleware; // Handler for the route
  method: HTTPMethod;
  middlewares?: KWMiddleware | KWMiddleware[]; // Array of middleware functions for this route
}

// A router can either be an array of `Route` or `RouteWithHandler`
export type Router = GroupRoute[] | RouteHandler[];

export enum HTTPMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  OPTIONS = 'options',
  HEAD = 'head',
}
