import path from 'node:path';
import {type Context, type Next} from 'koa';
import {render} from 'preact-render-to-string';
import {type FunctionComponent} from 'preact';
import {type UnknownRecord} from 'type-fest';

declare module 'koa' {
  interface Context {
    render: <L extends UnknownRecord = Record<string, unknown>>(
      viewName: string,
      locals: L,
    ) => Promise<void>;
  }

  interface Response {
    render: <L extends UnknownRecord = Record<string, unknown>>(
      viewName: string,
      locals: L,
    ) => Promise<void>;
  }
}

export async function renderMiddleware(viewPath: string) {
  return async (ctx: Context, next: Next) => {
    ctx.render = async <L extends UnknownRecord = Record<string, unknown>>(
      viewName: string,
      locals: L,
    ) => {
      const viewFilePath = path.join(viewPath, `${viewName}.jsx`);
      const {default: component} = (await import(viewFilePath)) as {
        default: FunctionComponent;
      };

      const app = component(locals ?? {})!;

      // const html = pug.renderFile(viewFilePath, locals);
      ctx.type = 'html';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ctx.body = render(app);
    };

    ctx.response.render = ctx.render;

    await next();
  };
}
