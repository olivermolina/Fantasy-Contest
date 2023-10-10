import { FAQCard, FAQCardProps } from './FAQCard';

interface FAQProps {
  faqs: FAQCardProps[];
}

export function FAQ(props: FAQProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
      {props.faqs?.map((item, i) => (
        <FAQCard key={i} {...item} />
      ))}
    </div>
  );
}
