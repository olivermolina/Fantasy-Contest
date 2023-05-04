export const showDollarPrefix = (value: number, isShowing?: boolean) => {
  if (!value) return isShowing ? `$0.00` : '0.00';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return isShowing ? formatter.format(value) : value.toFixed(2);
};
