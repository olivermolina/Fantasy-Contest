import Link from 'next/link';

export interface FAQCardProps {
  title: string;
  subItems: {
    title: string;
    link: string;
  }[];
}

export const FAQCard = (props: FAQCardProps) => {
  return (
    <div className="bg-white p-0 md:p-6">
      <h2 className="text-[1.375rem] font-light leading-[1.875rem] mb-3">
        {props.title}
      </h2>
      <div className="flex flex-col gap-2">
        {props.subItems.map((item, i) => (
          <Link key={`${item.link}-${i}`} href={item.link}>
            <a className="text-sm font-light hover:underline">{item.title}</a>
          </Link>
        ))}
      </div>
    </div>
  );
};
