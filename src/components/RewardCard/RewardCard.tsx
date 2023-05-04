import * as React from 'react';
import { Banner } from '@prisma/client';
import type { AppSettingsState } from '~/state/appSettings';

interface Props {
  banner: Banner;
  appSettings?: AppSettingsState;
  handleClick: () => void;
}

export default function RewardCard(props: Props) {
  const { banner, appSettings, handleClick } = props;
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
          ${banner.priority === 1 ? appSettings?.MAX_MATCH_DEPOSIT_AMOUNT : ''}
          {banner.priority === 2 ? appSettings?.REFERRAL_CREDIT_AMOUNT : ''}
        </span>
        <span className={'text-justify text-[#69A4F3]'}>{banner.text}</span>
      </div>
    </div>
  );
}
