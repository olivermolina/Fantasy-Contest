import Image from 'next/image';
import Link from 'next/link';
import { FAQ } from '~/components/FAQ/FAQ';
import { SocialLinks } from '~/components/SocialLinks/SocialLinks';
import { faqs } from '../../constants/FAQLinks';

export default function Help() {
  return (
    <div className="w-full md:grid justify-items-center">
      <div className="h-20 flex gap-4 mt-2 px-10 md:w-8/12 items-center">
        <Link href="/" rel="noreferrer" target="_self">
          <span className="cursor-pointer">
            <Image src="/blue-icon.png" height={50} width={50} alt="Logo" />
          </span>
        </Link>
        <p className="font-light text-sm">Help Center</p>
      </div>
      <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500 to-blue-600 w-full h-56 md:grid justify-items-center">
        <div className="h-full flex gap-4 p-10 md:px-14 md:w-8/12 flex-wrap content-end">
          <p className="text-3xl md:text-5xl text-white font-medium">
            Hello, how can we help you?
          </p>
        </div>
      </div>

      <FAQ faqs={faqs} />

      <div className="from-blue-500 bg-blue-600 w-full py-5 bg-gradient-to-b md:grid items-center justify-items-center">
        <div className="h-full flex flex-col md:flex-row px-14 md:w-8/12">
          <div className="hidden md:block md:flex-1"></div>
          <div className="flex flex-col md:flex-row px-10 items-center">
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
