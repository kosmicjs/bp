import clsx from 'clsx';
import titleize from 'titleize';
import humanizeString from 'humanize-string';

const pageList = [
  {name: 'installation'},
  {name: 'basic-setup'},
  {name: 'cli'},
  {name: 'development'},
];

type Props = {
  readonly pageName: string;
};

export default function SideNav({pageName}: Props) {
  return (
    <div class="list-group list-group-flush">
      {pageList.map((page) => (
        <a
          role="button"
          class={clsx('list-group-item list-group-item-action ', {
            'list-group-item-dark': pageName === page.name,
          })}
          href={`/docs/${page.name}`}
        >
          {titleize(humanizeString(page.name))}
        </a>
      ))}
    </div>
  );
}
