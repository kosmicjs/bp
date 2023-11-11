import NavItem, {type Props} from './nav-item.js';

export default function SideNav() {
  return (
    <div class="list-group list-group-flush">
      {([] as Props['dropdownItems']).map((item) => {
        return <NavItem key={item.title} {...item} />;
      })}
    </div>
  );
}
