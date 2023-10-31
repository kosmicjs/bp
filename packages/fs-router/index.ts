import process from 'node:process';
import path from 'node:path';
import {type Middleware, type Context} from 'koa';
import fg from 'fast-glob';
import {match as createMatchFn, type MatchFunction} from 'path-to-regexp';
import compose from 'koa-compose';
import z from 'zod';

declare module 'koa' {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface Params extends Record<string, string | undefined> {}
  interface Request {
    params?: Params;
  }

  interface Context {
    params?: Params;
  }
}

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';

const middlewareSchema = z.function().args(z.any()).returns(z.any());

const routeModuleSchema = z.object({
  get: middlewareSchema.optional(),
  post: middlewareSchema.optional(),
  put: middlewareSchema.optional(),
  patch: middlewareSchema.optional(),
  delete: middlewareSchema.optional(),
  head: middlewareSchema.optional(),
  options: middlewareSchema.optional(),
  weight: z.number().optional(),
  useBefore: z.array(middlewareSchema).optional(),
  useAfter: z.array(middlewareSchema).optional(),
});

// Create a TypeScript type from the schema
type RouteModule = z.TypeOf<typeof routeModuleSchema>;

type RouteDefinition = {
  uriPath: string;
  filePath: string;
  match: MatchFunction<Record<string, string | undefined>>;
  module: RouteModule;
  middleware?: Middleware;
  params?: Record<string, string | undefined>;
};

async function createFsRouter(
  routesDir = path.join(process.cwd(), 'routes'),
): Promise<{middleware: Middleware; routes: RouteDefinition[]}> {
  const middlewareByFileDir: {
    before: Record<string, Middleware>;
    after: Record<string, Middleware>;
  } = {before: {}, after: {}};

  // TODO: how to do ts?
  // needs to work with ts-node
  const files = await fg([
    `${routesDir}/**/*.{js,ts,cts,mts}`,
    `!${routesDir}/**/*.d.{js,ts,cts,mts}`,
  ]);

  const routesPromises: Array<Promise<RouteDefinition>> = files.map(
    async (filePath) => {
      let uriPath = filePath
        .replace(routesDir, '')
        .replace(/(\.js)|(\.ts)/, '')
        .replaceAll('/index', '')
        .replace(/\/*$/, '');

      if (uriPath === '') uriPath = '/';

      if (uriPath.includes('?')) {
        throw new Error(
          'fs-router does not support optional parameters in filenames',
        );
      }

      let module!: RouteModule;

      try {
        // need to handle errors better here...
        module = (await import(filePath)) as RouteModule;
      } catch (error) {
        console.error(error);
      }

      routeModuleSchema.parse(module);

      const middlewareBefore = module.useBefore && compose(module.useBefore);

      const middlewareAfter = module.useAfter && compose(module.useAfter);

      if (middlewareBefore)
        middlewareByFileDir.before[path.dirname(filePath)] = middlewareBefore;

      if (middlewareAfter)
        middlewareByFileDir.after[path.dirname(filePath)] = middlewareAfter;

      return {
        filePath,
        uriPath,
        match: createMatchFn<Record<string, string | undefined>>(uriPath),
        module,
        middlewareBefore,
        middlewareAfter,
      };
    },
  );

  // eslint-disable-next-line unicorn/no-await-expression-member
  const routes = (await Promise.all(routesPromises)).sort((a, b) =>
    a.uriPath < b.uriPath
      ? -1
      : a.uriPath > b.uriPath
      ? 1
      : a.uriPath.split('/').length < b.uriPath.split('/').length
      ? -1
      : 1,
  );

  console.log('routes', routes);

  const middleware: Middleware = async function (ctx: Context, next) {
    const collectedMiddleware: Middleware[] = [];
    const matchedHandler = routes.find((route) => {
      const [url] = ctx.originalUrl?.split('?') ?? [];
      const match = route.match(url);

      if (match) {
        route.params = match.params;
      }

      return match;
    });

    if (!matchedHandler) return next();

    const fn = matchedHandler?.module?.[ctx.method?.toLowerCase() as Method];

    if (!fn || typeof fn !== 'function') return next();

    const middleware: Middleware[] = [];

    if (matchedHandler) {
      for (const fileDir of Object.keys(middlewareByFileDir)) {
        if (path.dirname(matchedHandler.filePath).includes(fileDir)) {
          middleware.push(middlewareByFileDir.before[fileDir]);
        }
      }
    }

    if (middleware.length > 0) {
      await compose(middleware)(ctx, next);
    }

    ctx.request.params = matchedHandler?.params;

    await fn(ctx, next);
  };

  return {middleware, routes};
}

export default createFsRouter;
