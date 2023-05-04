import { isServerSide } from '../utils/isServerSide';
import { useRouter } from 'next/router';
import { IOffer } from '~/types';
import { GetServerSidePropsContext } from 'next';

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
export function useQueryParams(props?: {
  query?: GetServerSidePropsContext['query'];
}): useQueryParamsReturnType {
  const router = useRouter();
  const params = {
    ...props?.query,
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

  if (isServerSide()) {
    return {
      setParam: () => {
        console.log('Attempting to run code serverside.');
      },
      contestId: null,
      league: null,
      contestFilter: null,
      ...props?.query,
    };
  }

  return {
    setParam,
    ...params,
  };
}
