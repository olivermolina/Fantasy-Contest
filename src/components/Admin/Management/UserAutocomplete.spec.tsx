import { render } from '@testing-library/react';
import UserAutocomplete from './UserAutocomplete';
import { useForm } from 'react-hook-form';
import { ManagementInputs } from '~/components/Admin/Management/Management';
import { usersMock } from './__mocks__/usersMocks';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: () => <></>,
  useForm: () => ({
    control: () => ({}),
    handleSubmit: () => jest.fn(),
  }),
}));
describe('UserAutocomplete', () => {
  it('should render correctly', () => {
    const { control } = useForm<ManagementInputs>();
    const props = {
      users: usersMock,
      isLoading: false,
      control,
    };

    const container = render(<UserAutocomplete {...props} />);
    expect(container).toMatchSnapshot();
  });
});
