import { PaymentStatusCode } from '~/constants/PaymentStatusCode';
import { TransactionType } from '@prisma/client';

export const freePlayBonusCreditTableMockProps = {
  onSubmitDeletePlayFreeCredit: () => console.log('delete'),
  data: [
    {
      id: '1',
      transactionDate: new Date(),
      amountBonus: 100,
      status: PaymentStatusCode.COMPLETE,
      type: TransactionType.CREDIT,
    },
    {
      id: '2',
      transactionDate: new Date(),
      amountBonus: 100,
      status: PaymentStatusCode.CANCELLED,
      type: TransactionType.DEBIT,
    },
  ],
  totalBonusCreditBalance: 0,
};
