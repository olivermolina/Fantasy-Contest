export const mockDepositAmountProps = {
  setDepositAmount: () => {
    alert('Set Deposit amount');
  },
  handleNext: () => {
    alert('handleNext');
  },
  depositAmount: 10,
  isFirstDeposit: false,
  maxMatchDeposit: 50,
  depositAmountOptions: [10, 25, 50, 75, 100, 125],
  reloadBonusAmount: 0,
  reloadBonusType: 'FLAT',
  showBonusCreditStyles: false,
  minDepositAmount: 10,
};
