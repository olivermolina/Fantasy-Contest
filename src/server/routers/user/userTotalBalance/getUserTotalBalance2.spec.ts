import getUserTotalBalance from './getUserTotalBalance';

describe('Test getUserTotalBalance 2', () => {
  it('should not allow users to withdraw recently made deposits', async () => {
    const userTotalBalanceBeforeDeposit = await getUserTotalBalance(
      '0dca00b1-ebcb-40f1-aa14-de3eae2b0c15',
    );
    const playFree = await getUserTotalBalance(
      '2c1cbb95-5b1f-4bf5-8eda-dc5af334b77b',
    );
    console.log({ userTotalBalanceBeforeDeposit, playFree });
  }, 100000);
});
