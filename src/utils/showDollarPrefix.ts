export const showDollarPrefix = (value: number, isShow: boolean) => {
  return isShow ? `$${value.toFixed(2)}` : value.toFixed(2);
};
