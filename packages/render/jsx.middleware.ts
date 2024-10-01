import path from 'node:path';
import {pathToFileURL} from 'node:url';
import type Koa from 'koa';
import {render} from 'preact-render-to-string';
import {type VNode, type ComponentProps, type FunctionComponent} from 'preact';

declare module 'koa' {
  interface Locals {
    ctx: Koa.Context; // eslint-disable-line @typescript-eslint/no-unnecessary-qualifier
  }
  /**
   * render a jsx component template
   */
  type Render = (viewName: string, locals?: Locals) => Promise<void>;

  /**
   * render a jsx component template
   */
  type RenderRaw = (component: VNode) => Promise<void>;

  interface Context {
    render: Render;
    renderRaw: RenderRaw;
    /**
     * A global locals object that gets passed along the middleware chain.
     * When calling `ctx.render`, the locals object is merged with the passed in locals.
     * Extend this object to indicate to the typescript compiler what locals are available.
     */
    locals: Locals;
  }
  /**
   * render a jsx component template
   */
  interface Response {
    render: Render;
    renderRaw: RenderRaw;
    locals: Locals;
  }
}

export async function renderMiddleware(viewPath: string) {
  // eslint-disable-next-line func-names
  return async function renderJsx(context: Koa.Context, next: Koa.Next) {
    context.render = async (viewName: string, locals?: Koa.Locals) => {
      const viewFilePath = `${pathToFileURL(
        path.join(viewPath, `${viewName}.js`),
      ).toString()}`;

      if (context.accepts('html')) {
        const {default: component} = (await import(
          /* @vite-ignore */ viewFilePath
        )) as {
          default: FunctionComponent<ComponentProps<any>>;
        };

        const app = component({
          ...locals,
          ...context.locals,
          ...context.response.locals,
        })!;

        context.type = 'text/html';
        context.body = render(app);
      } else if (context.accepts('json')) {
        context.type = 'json';
        context.body = {
          ...locals,
          ...context.locals,
          ...context.response.locals,
        };
      }
    };

    context.renderRaw = async (component: VNode) => {
      context.type = 'text/html';
      context.body = render(component);
    };

    context.response.render = context.render;
    context.response.renderRaw = context.renderRaw;
    await next();
  };
}
