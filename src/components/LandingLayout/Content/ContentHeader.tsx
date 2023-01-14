import React from 'react';

const ContentHeader = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-y-2 md:gap-y-5">
      <p className="text-white text-[60px] md:text-[90.44px] font-bold text-center leading-[77px] tracking-normal md:my-10">
        The Fantasy Sports Hub!
      </p>
      <div className="flex items-center justify-center gap-x-1 md:gap-x-5  w-full md:w-5/6 lg:w-4/5 max:w-2/5">
        <div className={'min-w-fit'}>
          <img
            className="object-cover w-[60px] h-auto md:w-auto"
            src={'/assets/images/trophy.svg'}
            alt="Trophy"
          />
        </div>
        <p className="text-white text-[24px] md:text-[40px] font-bold text-center tracking-normal">
          Select More or Less on player stats to win up to 10x your cash!
        </p>
        <div className={'min-w-fit'}>
          <img
            className="object-cover w-[60px] h-auto md:w-auto"
            src={'/assets/images/football.svg'}
            alt="Football"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
