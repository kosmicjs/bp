import path from 'node:path';
import type {Context} from 'koa';
import clsx from 'clsx';

const buttonList = [
  {
    href: '/docs/installation',
    text: 'Installation',
  },
  {
    href: '/docs/basic-setup',
    text: 'Basic Setup',
  },
  {
    href: '/docs/cli',
    text: 'CLI',
  },
  {
    href: '/docs/development',
    text: 'Development',
  },
];

export default function SideNav({ctx}: {readonly ctx: Context}) {
  return (
    <div class="list-group list-group-flush">
      {buttonList.map((button) => (
        <a
          role="button"
          class={clsx('list-group-item list-group-item-action', {
            'list-group-item-dark':
              ctx.params?.page === path.basename(button.href),
          })}
          href={button.href}
        >
          {button.text}
        </a>
      ))}
    </div>
  );
}
