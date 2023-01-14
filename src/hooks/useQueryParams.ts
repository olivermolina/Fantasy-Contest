import { isServerSide } from '../utils/isServerSide';
import { useRouter } from 'next/router';
import { IOffer } from '~/types';
import { useEffect } from 'react';
import { UrlPaths } from '~/constants/UrlPaths';
import { League } from '@prisma/client';

type useQueryParamsReturnType = {
  setParam: (
    param: keyof Omit<useQueryParamsReturnType, 'setParam'>,
    val: any,
  ) => void;
  contestId: string | null;
  league: IOffer['league'] | null;
  contestFilter: string | null;
};

/**
 * Will provide an interface to all the supported query parameters available in the project.
 */
export function useQueryParams(): useQueryParamsReturnType {
  const router = useRouter();
  const params = {
    ...router.query,
  } as Omit<useQueryParamsReturnType, 'setParam'>;

  const setParam: (
    param: keyof Omit<useQueryParamsReturnType, 'setParam'>,
    val: any,
  ) => void = (param, val) => {
    params[param] = val;
    router.push(
      {
        query: {
          ...params,
          [param]: val,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  useEffect(() => {
    if (
      router.asPath.includes(UrlPaths.Challenge) &&
      params.league === undefined
    ) {
      setParam('league', League.NFL);
      params.league = League.NFL;
    }
  }, []);

  if (isServerSide()) {
    return {
      setParam: () => {
        console.log('Attempting to run code serverside.');
      },
      contestId: null,
      league: null,
      contestFilter: null,
    };
  }

  return {
    setParam,
    ...params,
  };
}
