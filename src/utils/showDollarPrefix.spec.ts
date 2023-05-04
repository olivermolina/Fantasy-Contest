import { showDollarPrefix } from '~/utils/showDollarPrefix';

describe('showDollarPrefix', () => {
  it('should format the number to dollar currency', () => {
    expect(showDollarPrefix(100, true)).toStrictEqual('$100.00');
  });

  it('should format the number to 2 decimal places without dollar sign', () => {
    expect(showDollarPrefix(1.12121212)).toStrictEqual('1.12');
  });
});
