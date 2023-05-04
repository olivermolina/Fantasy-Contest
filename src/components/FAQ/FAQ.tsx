import { FAQCard, FAQCardProps } from './FAQCard';

interface FAQProps {
  faqs: FAQCardProps[];
}

export function FAQ(props: FAQProps) {
  return (
    <div className="md:w-8/12 px-10 py-20 grid md:grid-cols-3 gap-16">
      {props.faqs?.map((item, i) => (
        <FAQCard key={i} {...item} />
      ))}
    </div>
  );
}
