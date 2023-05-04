import { SidebarItem, SidebarItemProps } from './SidebarItem';

interface SidebarProps {
  faqs: SidebarItemProps[];
}

export const Sidebar = (props: SidebarProps) => {
  return (
    <div className="w-3/12 hidden md:block">
      <ul className="leading-[2.75em] font-light gap-4">
        {props.faqs?.map((item, i) => (
          <SidebarItem {...item} key={i} />
        ))}
      </ul>
    </div>
  );
};
