import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import leagues from '../Nav/leagues';
import { TokenCount } from './TokenCount';
import { navItems } from './navItems';
import { CashAmount } from './CashAmount';
import { useQueryParams } from '~/hooks/useQueryParams';
import Link from 'next/link';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { ContestCategory } from '@prisma/client';

interface Props {
  onClickCartDetails?: React.MouseEventHandler<HTMLButtonElement>;
  cartItemsCount?: number;
  cartStake?: number;
  cartPotentialPayout?: number;
  userCashAmount: number;
  currentContestTokenCount?: number;
  children: JSX.Element;
  onClickAddUserCash?: React.MouseEventHandler<HTMLButtonElement>;
  showSubNav?: boolean;
  showTokenCount?: boolean;
  playersSelected?: number;
  showMobileCart?: boolean;
  contestCategory?: ContestCategory;
}

function NavLink(props: { link: string; icon: any; name: string }) {
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (window.location.pathname.includes(props.link)) {
      setActive(true);
    }
  }, [props.link]);

  return (
    <Link href={props.link}>
      <span
        className={classNames(
          'flex cursor-pointer flex-col justify-center text-gray-300 lg:mx-4',
          {
            underline: isActive,
          },
        )}
      >
        {props.icon}
        {props.name}
      </span>
    </Link>
  );
}

export const Layout: React.FC<Props> = (props) => {
  const { setParam, league } = useQueryParams();
  return (
    <div className="flex flex-col h-full">
      {/* Top Nav Desktop */}
      <div className="h-28 hidden lg:grid grid-cols-3 items-center bg-blue-600 lg:border-b p-4 border-gray-400">
        <Logo key="top" />
        <CashAmount
          onClickAddUserCash={props.onClickAddUserCash}
          userCashAmount={props.userCashAmount}
        />
        <nav className="hidden overflow-x-auto lg:flex justify-end gap-4">
          {navItems.map(({ link, icon, name }) => (
            <NavLink key={link} link={link} icon={icon} name={name}></NavLink>
          ))}
        </nav>
      </div>

      {/* Top Nav Mobile */}
      <div className="h-16 bg-blue-600 items-center grid grid-cols-3 lg:hidden">
        <div></div>
        <div className="flex justify-center">
          <Logo key="bottom" scale={3} />
        </div>
        <div className="p-4 flex justify-end">
          {props.showTokenCount ? (
            <TokenCount count={props.currentContestTokenCount || 0} />
          ) : (
            <CashAmount
              onClickAddUserCash={props.onClickAddUserCash}
              userCashAmount={props.userCashAmount}
            />
          )}
        </div>
      </div>

      {/* SubNav */}
      {props.showSubNav && (
        <div className="bg-blue-600 flex justify-between border-b border-gray-400">
          {/* Left Pane */}
          <div className="grid grid-cols-5 border-gray-200">
            <div className="col-span-5 lg:col-span-4 py-2.5 flex overflow-x-auto">
              {Object.entries(leagues).map(([name, { Icon }], i) => (
                <a
                  key={i}
                  onClick={() => {
                    setParam('league', name);
                  }}
                  className={classNames(
                    'inline-flex text-white mx-3.5 flex-col justify-center text-center items-center p-1',
                    {
                      'underline bg-blue-800':
                        league?.toUpperCase() === name.toUpperCase(),
                    },
                  )}
                >
                  <Icon
                    isSelected={league?.toUpperCase() === name.toUpperCase()}
                  />
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* Right Pane */}
          {props.showTokenCount ? (
            <div className="p-4 hidden lg:block">
              <TokenCount count={props.currentContestTokenCount || 0} />
            </div>
          ) : null}
        </div>
      )}

      <div className="flex flex-grow overflow-y-auto bg-gray-50">
        {props.children}
      </div>

      {/* Bottom Bar */}
      <div className="block lg:hidden">
        {props.cartItemsCount !== 0 &&
        props.playersSelected !== 0 &&
        props.showMobileCart ? (
          <button
            onClick={props.onClickCartDetails}
            className="rounded-lg rounded-b-none text-white shadow-md p-1 w-full bg-blue-600"
            disabled={
              props.contestCategory?.numberOfPicks !== props.playersSelected
            }
          >
            {Number(props.contestCategory?.numberOfPicks) ===
            Number(props.playersSelected) ? (
              <div className="flex justify-evenly items-center">
                <div>
                  <span className="text-white text-md lg:text-xl opacity-40">
                    {props.playersSelected} Players Selected
                  </span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <span className="text-white text-md lg:text-xl">
                    Finalize Entry
                  </span>
                  <div className="pt-1">
                    <ArrowRightAltIcon fontSize={'large'} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <span className="text-white text-xl opacity-40">
                  Select{' '}
                  {Number(props.contestCategory?.numberOfPicks) -
                    Number(props.playersSelected)}{' '}
                  More Player to Proceed.
                </span>
              </div>
            )}
          </button>
        ) : null}

        <nav className="overflow-x-auto bg-blue-600 p-4 justify-between flex gap-4">
          {navItems.map(({ link, icon, name }) => (
            <NavLink key={link} link={link} icon={icon} name={name}></NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

Layout.defaultProps = {
  cartItemsCount: 0,
  cartStake: 0,
  cartPotentialPayout: 0,
};
