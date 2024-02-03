/* eslint-disable @typescript-eslint/no-empty-interface */
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {type Context, type Next, type Locals} from 'koa';
import {render} from 'preact-render-to-string';
import {type ComponentProps, type FunctionComponent} from 'preact';

declare module 'koa' {
  /**
   * A global locals object that gets passed along the middleware chain.
   * When calling `ctx.render`, the locals object is merged with the passed in locals.
   * Extend this object to indicate to the typescript compiler what locals are available.
   */
  interface Locals {}
  /**
   * render a jsx component template
   */
  type Render = <L extends Record<string, unknown> = Record<string, unknown>>(
    viewName: string,
    locals?: Omit<L, keyof Locals>,
  ) => Promise<void>;
  /**
   * render a jsx component template
   */
  interface Context {
    render: Render;
    locals: Locals;
  }
  /**
   * render a jsx component template
   */
  interface Response {
    render: Render;
    locals: Locals;
  }
}

export async function renderMiddleware(viewPath: string) {
  return async (ctx: Context, next: Next) => {
    ctx.render = async <
      L extends Record<string, unknown> = Record<string, unknown>,
    >(
      viewName: string,
      locals?: Omit<L, keyof Locals>,
    ) => {
      const viewFilePath = `${pathToFileURL(
        path.join(viewPath, `${viewName}.js`),
      ).toString()}`;

      if (ctx.accepts('html')) {
        const {default: component} = (await import(viewFilePath)) as {
          default: FunctionComponent<ComponentProps<any> & typeof locals>;
        };

        const app = component({
          ...locals,
          ...ctx.locals,
          ...ctx.response.locals,
        })!;

        ctx.type = 'html';

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ctx.body = render(app);
      } else if (ctx.accepts('json')) {
        ctx.type = 'json';
        ctx.body = {
          ...locals,
          ...ctx.locals,
          ...ctx.response.locals,
        };
      }
    };

    ctx.response.render = ctx.render;
    await next();
  };
}
