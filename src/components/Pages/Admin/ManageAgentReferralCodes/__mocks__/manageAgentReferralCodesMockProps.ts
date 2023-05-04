import { usersMock } from '~/components/Admin/Management/__mocks__/usersMocks';

export const manageAgentReferralCodesMockProps = {
  onSubmit: () => alert('test'),
  users: usersMock,
  isLoading: false,
  deleteReferralCode: () => alert('delete'),
};
