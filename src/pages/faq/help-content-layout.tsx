import Link from 'next/link';
import React from 'react';
import { Sidebar } from '~/components/FAQ/Sidebar';
import { faqs } from '../../constants/FAQLinks';
import LandingLayout from '~/components/LandingLayout';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function HelpContentLayout(props: Props) {
  return (
    <LandingLayout>
      <div className="flex-grow lg:flex lg:justify-center w-full">
        <div
          className={
            'flex flex-col gap-6 lg:max-w-5xl w-full justify-start py-5 px-5 lg:px-0'
          }
        >
          <div className="flex text-lg text-balance lg:text-3xl font-bold gap-2 ">
            <Link href="/faq">
              <span className="hover:underline underline-offset-4 cursor-pointer">
                Help Center
              </span>
            </Link>
            <span className="text-white">&gt;</span>
            <h1 className="underline underline-offset-4">{props.title}</h1>
          </div>

          <div className="flex flex-row">
            <Sidebar faqs={faqs} />
            <div className="md:w-4/6 md:pl-10">{props.children}</div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
