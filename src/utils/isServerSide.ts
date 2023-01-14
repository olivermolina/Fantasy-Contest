/**
 * Whether or not we're in a SSR context
 */
export const isServerSide = () => {
  return typeof window === 'undefined';
};
