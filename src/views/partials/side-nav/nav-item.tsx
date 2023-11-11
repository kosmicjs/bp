import {Fragment} from 'preact';

export type Props = {
  readonly dropdownItems: Array<{
    readonly title: string;
    readonly items: Array<{
      readonly title: string;
      readonly href: string;
    }>;
  }>;
};

export default function SideNav({dropdownItems}: Props) {
  return dropdownItems.map((item) => {
    return (
      <Fragment key={item.title}>
        <button
          type="button"
          class="list-group-item list-group-item-action"
          data-bs-toggle="collapse"
          data-bs-target="#home-collapse"
          aria-expanded="false"
        >
          Getting Started
        </button>
        <div class="collapse" id="home-collapse">
          <div class="list-group list-group-flush">
            <button
              type="button"
              class="list-group-item list-group-item-action"
              hx-get="/docs/getting-started"
              hx-target="#docs-content"
            >
              Installation
            </button>
            <button
              type="button"
              class="list-group-item list-group-item-action"
              hx-get="/docs/getting-started"
              hx-target="#docs-content"
            >
              Installation
            </button>
          </div>
        </div>
      </Fragment>
    );
  });
}
