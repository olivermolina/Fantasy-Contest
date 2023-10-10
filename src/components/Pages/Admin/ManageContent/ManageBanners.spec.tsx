import { render } from '@testing-library/react';
import ManageBanners from './ManageBanners';
import { manageBannerMock } from './__mocks__/manageBannerMock';

describe('ManageBanners', () => {
  it('should render correctly', () => {
    const { container } = render(<ManageBanners {...manageBannerMock} />);
    expect(container).toMatchSnapshot();
  });
});
