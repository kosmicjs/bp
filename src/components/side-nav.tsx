import path from 'node:path';
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

type Props = {
  readonly pageName: string;
};

export default function SideNav({pageName}: Props) {
  return (
    <div class="list-group list-group-flush">
      {buttonList.map((button) => (
        <a
          role="button"
          class={clsx('list-group-item list-group-item-action ', {
            'list-group-item-dark': pageName === path.basename(button.href),
          })}
          href={button.href}
        >
          {button.text}
        </a>
      ))}
    </div>
  );
}
