import Link from 'next/link';

export interface SidebarItemProps {
  title: string;
  subItems: {
    title: string;
    link: string;
  }[];
}

export const SidebarItem = (props: SidebarItemProps) => (
  <li>
    <>
      <Link href="/">
        <span className="font-normal">{props.title}</span>
      </Link>
      <ul className="pl-4">
        {props.subItems?.map((item, i) => {
          return (
            <li
              key={`${item.title}-${i}`}
              className="hover:underline underline-offset-4 cursor-pointer text-sm"
            >
              <Link href={item.link} target="_self">
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  </li>
);
