import path from 'node:path';
import type {Context} from 'koa';
import clsx from 'clsx';

const buttonList = [
  {
    href: '/docs/installation',
    text: 'Getting started',
  },
  {
    href: '/docs/cli',
    text: 'CLI',
  },
];

export default function SideNav({ctx}: {readonly ctx: Context}) {
  return (
    <div class="list-group list-group-flush">
      <div class="list-group list-group-flush">
        {buttonList.map((button) => (
          <a
            role="button"
            class={clsx('list-group-item list-group-item-action text-end', {
              'list-group-item-dark':
                ctx.params?.page === path.basename(button.href),
            })}
            href={button.href}
          >
            {button.text}
          </a>
        ))}
      </div>
    </div>
  );
}
