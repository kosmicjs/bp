/* eslint-disable complexity */
/* eslint-disable max-depth */
import process from 'node:process';
import path from 'node:path';
import {type Middleware, type Context} from 'koa';
import {globby} from 'globby';
import {match as createMatchFn} from 'path-to-regexp';
import compose from 'koa-compose';
import {routeModuleSchema} from './schema.js';
import {
  type HttpVerb,
  type HttpVerbsAll,
  type RouteModule,
  type RouteDefinition,
} from './types.js';

declare module 'koa' {
  interface Params extends Record<string, string | undefined> {}
  interface Request {
    params?: Params;
  }

  interface Context {
    params?: Params;
  }
}

const verbs: HttpVerb[] = ['get', 'post', 'put', 'patch', 'delete'];

const verbsWithAll: HttpVerbsAll[] = [...verbs, 'all'];

export async function createFsRouter(
  routesDir = path.join(process.cwd(), 'routes'),
): Promise<{middleware: Middleware; routes: RouteDefinition[]}> {
  /**
   * create a function on start up that transforms filePaths
   * with the correct convention to path-to-regexp compatible paths
   */
  const getUriPathFromFilePath = (filePath: string): string =>
    filePath
      .replaceAll(
        new RegExp(`(${routesDir})|(\\.(j|t)sx?)|(\\/index)|(\\/*$)`, 'g'),
        '',
      )
      .split(path.sep)
      .map((part) => {
        if (/^\[.*]$/.test(part)) {
          return part.replace(/^\[/, ':').replace(/]$/, '');
        }

        return part;
      })
      .join('/');

  /**
   * Files can automatically handle ts extensions with no added overhead
   */
  const files = await globby([
    `${routesDir}/**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}`,
    `!${routesDir}/**/*.d.{ts,tsx,cts,mts}`,
  ]);

  const routesFromFilesPromises: Array<Promise<RouteDefinition>> = files.map(
    async (filePath) => {
      const uriPath = getUriPathFromFilePath(filePath);

      const module: RouteModule | undefined = (await import(
        /* @vite-ignore */
        filePath
      )) as RouteModule;

      if (module.del) {
        module.delete = module.del;
      }

      routeModuleSchema.parse(module);

      return {
        filePath,
        uriPath,
        match: createMatchFn<Record<string, string | undefined>>(uriPath),
        module,
      };
    },
  );

  // eslint-disable-next-line unicorn/no-await-expression-member
  const routes = (await Promise.all(routesFromFilesPromises)).sort((a, b) =>
    a.uriPath < b.uriPath
      ? -1
      : a.uriPath > b.uriPath
        ? 1
        : a.uriPath.split('/').length < b.uriPath.split('/').length
          ? -1
          : 1,
  );

  const routesByUriPath: Record<string, RouteDefinition> = {};

  for (const route of routes) {
    routesByUriPath[route.uriPath] = route;
  }

  // After sorting, we can pre-compose the middleware for each route
  for (const route of routes) {
    const collectedMiddleware: Record<HttpVerbsAll, Middleware[]> = {
      get: [],
      post: [],
      put: [],
      patch: [],
      delete: [],
      all: [],
    };

    // for each route, loop over the routes and collect the middleware
    // stopping when we reach the current route. In this way we can pre-compose
    // the middleware combinations needed for each route and avoid doing it at runtime in the handler
    for (const {module, uriPath} of routes) {
      // function condition
      if (typeof module.use === 'function') {
        if (route.uriPath.includes(uriPath)) {
          collectedMiddleware.all.push(module.use);
        }
        // array condition
      } else if (Array.isArray(module.use)) {
        for (const use of module.use) {
          // function condition in array
          if (typeof use === 'function') {
            if (route.uriPath.includes(uriPath)) {
              collectedMiddleware.all.push(use);
            }
            // object condition in array
          } else if (typeof use === 'object') {
            for (const verb of verbsWithAll) {
              const useVerb = use[verb];
              if (useVerb && typeof useVerb === 'function') {
                collectedMiddleware[verb].push(useVerb);
              }
            }
          }
        }
        // object condition
      } else if (module.use && typeof module.use === 'object') {
        for (const verb of verbsWithAll) {
          const useVerb = module.use[verb];
          if (useVerb && typeof useVerb === 'function') {
            collectedMiddleware[verb].push(useVerb);
          }
        }
      }

      if (route.uriPath === uriPath) {
        break;
      }
    }

    // now for each http verb, we have a fully pre-composed method
    // that excutes all the middleware in the correct order including the route handler
    for (const verb of verbs) {
      const routeVerbHandler = route.module[verb];
      if (routeVerbHandler) {
        route[verb] = compose([
          ...collectedMiddleware.all,
          ...collectedMiddleware[verb],
          routeVerbHandler,
        ]);
      }
    }

    route.collectedMiddleware = collectedMiddleware;
  }

  const middleware: Middleware = async function (ctx: Context, next) {
    const matchedRoute = routes.find((route) => {
      const [url] = ctx.originalUrl?.split('?') ?? [];
      const match = route.match(url);

      if (match) {
        route.params = match.params;
      }

      return match;
    });

    // eslint-disable-next-line no-console
    console.log(matchedRoute);

    if (!matchedRoute) return next();
    const fn = matchedRoute?.[ctx.method?.toLowerCase() as HttpVerb];
    if (!fn || typeof fn !== 'function') return next();
    ctx.request.params = matchedRoute?.params;
    ctx.params = matchedRoute?.params;
    await fn(ctx, next);
  };

  return {middleware, routes};
}

export default createFsRouter;
