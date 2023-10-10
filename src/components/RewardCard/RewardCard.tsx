import * as React from 'react';
import { AppSettings, Banner } from '@prisma/client';

interface Props {
  banner: Banner & { appSetting: AppSettings | null };
  handleClick: () => void;
}

export default function RewardCard(props: Props) {
  const { banner, handleClick } = props;
  return (
    <div
      className={
        'flex flex-row gap-4 justify-start items-center bg-[#1a395b] p-4 rounded-lg cursor-pointer'
      }
      onClick={handleClick}
    >
      <img
        className="object-cover w-28 h-28"
        src={'/assets/images/ico_gift_w_block.svg'}
        alt="Gift"
      />
      <div className={'flex flex-col gap-2 max-w-[300px]'}>
        <span className={'text-white text-3xl font-bold'}>
          ${banner.appSetting?.value}
        </span>
        <span className={'text-justify text-[#69A4F3]'}>{banner.text}</span>
      </div>
    </div>
  );
}
