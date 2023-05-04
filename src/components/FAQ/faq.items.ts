import { UrlPaths } from '~/constants/UrlPaths';
import { SidebarItemProps } from './SidebarItem';

const faqs: SidebarItemProps[] = [
  {
    title: 'Contact Us',
    subItems: [
      {
        title: 'Reach out to us 24/7!',
        link: UrlPaths.ContactUs,
      },
    ],
  },
  {
    title: 'Promotions & Bonuses',
    subItems: [
      {
        title: 'What are our promotions & bonuses?',
        link: UrlPaths.PromotionsAndBonuses,
      },
    ],
  },
  {
    title: 'Contest Rules',
    subItems: [
      {
        title: 'Read LockSpread Contest Rules',
        link: UrlPaths.ContestRules,
      },
    ],
  },
  {
    title: 'Deposit',
    subItems: [
      {
        title: 'How to deposit',
        link: UrlPaths.FAQDeposit,
      },
    ],
  },
  {
    title: 'Withdrawal',
    subItems: [
      {
        title: 'How to withdraw your money',
        link: UrlPaths.FAQWithdrawal,
      },
    ],
  },
  {
    title: 'Account Management',
    subItems: [
      {
        title: 'Learn how to manage your account',
        link: UrlPaths.FAQAccountManagement,
      },
    ],
  },
  {
    title: 'Turning on Location',
    subItems: [
      {
        title: 'Why we need your location?',
        link: UrlPaths.FAQLocation,
      },
      {
        title: 'Where we currently operate',
        link: UrlPaths.FAQLocations,
      },
    ],
  },
  {
    title: 'Refund Policy',
    subItems: [
      {
        title: 'Know your refund rights',
        link: UrlPaths.RefundPolicy,
      },
    ],
  },
  {
    title: 'Responsible Gaming',
    subItems: [
      {
        title: 'Read about how to play responsibly',
        link: UrlPaths.ResponsibleGaming,
      },
    ],
  },
  {
    title: 'Request Help!',
    subItems: [
      {
        title: 'Fill in the form in this page',
        link: UrlPaths.ContactUs,
      },
    ],
  },
];

export { faqs };
