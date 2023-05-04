import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Sidebar } from '~/components/FAQ/Sidebar';
import { SocialLinks } from '~/components/SocialLinks/SocialLinks';
import { faqs } from '../../constants/FAQLinks';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function HelpContentLayout(props: Props) {
  return (
    <div className="help-content-layout flex flex-col min-h-screen min-w-full">
      <div className="md:grid justify-items-center">
        <div className="flex h-20 gap-4 mt-2 px-10 md:w-8/12 items-center">
          <Link href="/" rel="noreferrer" target="_self">
            <span className="cursor-pointer">
              <Image src="/blue-icon.png" width={50} height={50} alt="logo" />
            </span>
          </Link>
        </div>
      </div>
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500 to-blue-600  h-20 md:grid justify-items-center">
        <div className="flex flex-wrap gap-2 px-12 md:w-8/12 w-ful h-20 content-end items-center pb-4">
          <Link href="/faq">
            <span className="text-white !leading-none font-light hover:underline underline-offset-4 cursor-pointer">
              Help Center
            </span>
          </Link>
          <span className="text-white">&gt;</span>
          <p className="text-white !font-normal !leading-none underline underline-offset-4">
            {props.title}
          </p>
        </div>
      </div>
      <div className="flex-grow">
        <div className="md:grid justify-items-center">
          <div className="md:w-8/12 flex flex-row p-12">
            <Sidebar faqs={faqs} />
            <div className="md:w-9/12 pb-32 px-5">{props.children}</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-blue-500 bg-blue-600 h-20 w-full py-5 md:relative fixed bottom-0">
        <div className="md:grid items-center justify-items-center">
          <div className="h-full flex flex-col md:flex-row md:px-14 md:w-8/12">
            <div className="hidden md:block md:flex-1"></div>
            <div className="px-10 flex flex-col md:flex-row items-center">
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
