import { render } from '@testing-library/react';
import BannerForm from './BannerForm';
import { bannerMock } from './__mocks__/bannerMock';

describe('BannerForm', () => {
  it('should render correctly', () => {
    const mockProps = {
      banner: bannerMock,
      closeForm: jest.fn(),
      onSubmit: jest.fn(),
      appSettings: [],
    };

    const { container } = render(<BannerForm {...mockProps} />);
    expect(container).toMatchSnapshot();
  });
});
