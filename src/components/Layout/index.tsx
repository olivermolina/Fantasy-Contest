import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Logo } from './Logo';
import leagues from '../Nav/leagues';
import { TokenCount } from './TokenCount';
import { navItems } from './navItems';
import { CashAmount } from './CashAmount';
import { useQueryParams } from '~/hooks/useQueryParams';
import Link from 'next/link';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { ContestCategory } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import type { LeagueFantasyOffersCount } from '~/server/routers/contest/getLeaguesMarketCount';
import { Skeleton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import _ from 'lodash';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#003370',
      light: '#69a4f3',
      dark: '#002248',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff',
      contrastText: '#003370',
    },
    error: {
      main: '#de0505',
      contrastText: '#fff',
    },
    warning: {
      main: '#7F6A0A',
      contrastText: '#002248',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: () => ({
          color: '#fff',
          backgroundColor: '#1A395B',
          '& label': {
            color: '#fff',
          },
          '& label.Mui-focused': {
            color: '#fff',
          },
          '& .MuiInput-underline:after': {
            borderColor: '#fff',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#fff',
            },
            '&:hover fieldset': {
              borderColor: '#fff',
              borderWidth: '0.15rem',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff',
            },
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: () => ({
          color: '#fff',
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.primary.contrastText,
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
          },
          '&:disabled': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
          },
        }),
      },
    },
  },
});

interface Props {
  query: GetServerSidePropsContext['query'] | undefined;
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
  leagueFantasyOffersCount: LeagueFantasyOffersCount[];
  handleSetCategoryBgColor: (color: string) => void;
  isLoading?: boolean;
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
          'flex cursor-pointer flex-col justify-center lg:mx-4',
          {
            'text-gray-500': !isActive,
            'text-white': isActive,
          },
        )}
      >
        {props.icon}
        {props.name}
      </span>
    </Link>
  );
}

const leaguesMap = Object.entries(leagues);

export const Layout: React.FC<Props> = (props) => {
  const { setParam, league } = useQueryParams({ query: props.query });

  // Filter nav leagues with available offers & markets
  const availableLeagues = useMemo(
    () =>
      props.leagueFantasyOffersCount?.reduce((acc: typeof leaguesMap, row) => {
        if (row.count > 0) {
          const leagueOption = _.get(leagues, row.league.toString());
          acc.push([row.league.toString(), leagueOption]);
        }

        return acc;
      }, []),
    [props.leagueFantasyOffersCount],
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col h-full">
        {/* Top Nav Desktop */}
        <div className="h-28 hidden lg:grid grid-cols-3 items-center bg-primary lg:border-b p-4 border-gray-400">
          <Logo key="top" isLoggedIn={true} />
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
        <div
          className={
            'bg-primary items-center grid grid-cols-3 lg:hidden border-b border-gray-400'
          }
        >
          <span />
          <div className="flex justify-center items-center pt-2">
            <Logo key="bottom" isLoggedIn={true} scale={4} />
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
        <div className="flex flex-col flex-grow overflow-y-auto bg-secondary">
          {/* SubNav */}
          {props.showSubNav && (
            <div
              className={classNames(
                'bg-primary flex justify-between border-b border-gray-400 transition duration-500',
              )}
            >
              {/* Left Pane */}
              <div className="grid grid-cols-5 border-gray-200">
                <div className="col-span-5 lg:col-span-4 py-2.5 flex overflow-x-auto">
                  {props.isLoading && (
                    <div className={'flex flex-row gap-4 p-2'}>
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={75}
                        sx={{ bgcolor: '#144e97' }}
                      />

                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={75}
                        sx={{ bgcolor: '#144e97' }}
                      />

                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={75}
                        sx={{ bgcolor: '#144e97' }}
                      />
                    </div>
                  )}

                  {availableLeagues?.map(([name, { Icon }], i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setParam('league', name);
                      }}
                      className={classNames(
                        'text-white inline-flex mx-3.5 flex-col justify-center text-center items-center p-1',
                        {
                          'text-opacity-40':
                            league?.toUpperCase() !== name.toUpperCase(),
                        },
                      )}
                    >
                      <Icon
                        isSelected={
                          league?.toUpperCase() === name.toUpperCase()
                        }
                      />
                      {name}
                    </button>
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

          {props.children}
        </div>

        {/* Bottom Bar */}
        <div
          className={
            'h-1 w-full bg-gradient-to-b from-secondary to-primary block lg:hidden'
          }
        />
        <div className="block lg:hidden bg-secondary">
          {props.cartItemsCount !== 0 &&
          props.playersSelected !== 0 &&
          props.showMobileCart ? (
            <button
              onClick={props.onClickCartDetails}
              className="flex items-center justify-around gap-2 rounded-lg rounded-b-none text-white shadow-md p-1 w-full bg-selected h-10"
              disabled={
                props.contestCategory?.numberOfPicks !== props.playersSelected
              }
            >
              {Number(props.contestCategory?.numberOfPicks) ===
              Number(props.playersSelected) ? (
                <div className="flex justify-evenly items-center gap-2">
                  <span className="text-white text-md lg:text-xl opacity-40">
                    {props.playersSelected} Players Selected
                  </span>
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
                  <span className="text-white text-md lg:text-xl opacity-40">
                    Select{' '}
                    {Number(props.contestCategory?.numberOfPicks) -
                      Number(props.playersSelected)}{' '}
                    More Player to Proceed.
                  </span>
                </div>
              )}
            </button>
          ) : null}

          <nav className="overflow-x-auto bg-primary p-4 justify-between flex gap-4">
            {navItems.map(({ link, icon, name }) => (
              <NavLink key={link} link={link} icon={icon} name={name}></NavLink>
            ))}
          </nav>
        </div>
      </div>
    </ThemeProvider>
  );
};

Layout.defaultProps = {
  cartItemsCount: 0,
  cartStake: 0,
  cartPotentialPayout: 0,
};
