import { render } from '@testing-library/react';
import AppSettings from './AppSettings';
import { appSettingsMockProps } from './__mocks__/appSettingsMockProps';

describe('AppSettings', () => {
  it('should render correctly', () => {
    const { container } = render(<AppSettings {...appSettingsMockProps} />);
    expect(container).toMatchSnapshot();
  });
});
