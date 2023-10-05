import * as path from 'node:path';
import * as fs from 'node:fs';
import {type Context, type Next} from 'koa';
import * as pug from 'pug';
import {type LocalsObject} from 'pug';

declare module 'koa' {
  interface Context {
    render: (viewName: string, locals: LocalsObject) => Promise<void>;
  }

  interface Response {
    render: (viewName: string, locals: LocalsObject) => Promise<void>;
  }
}

export function renderMiddleware(viewPath: string) {
  return async (ctx: Context, next: Next) => {
    ctx.render = async (viewName: string, locals: LocalsObject) => {
      const viewFilePath = path.join(viewPath, `${viewName}.pug`);
      const html = pug.renderFile(viewFilePath, locals);
      ctx.type = 'html';
      ctx.body = html;
    };

    ctx.response.render = ctx.render;

    await next();
  };
}
