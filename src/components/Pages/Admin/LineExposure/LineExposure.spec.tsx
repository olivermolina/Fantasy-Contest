import { render } from '@testing-library/react';
import LineExposure from './LineExposure';
import { lineExposureMockProps } from './__mocks__/lineExposureMockProps';

describe('LineExposure', () => {
  it('should render correctly', () => {
    const container = render(<LineExposure {...lineExposureMockProps} />);
    expect(container).toMatchSnapshot();
  });
});
