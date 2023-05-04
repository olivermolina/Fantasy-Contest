import { render } from '@testing-library/react';
import LineExposureDetailsDialog from './LineExposureDetailsDialog';
import { lineExposureDetailsDialogMockProps } from '~/components/Pages/Admin/LineExposure/__mocks__/lineExposureDetailsDialogMockProps';

describe('LineExposureDetailsDialog', () => {
  it('should render correctly', () => {
    const container = render(
      <LineExposureDetailsDialog {...lineExposureDetailsDialogMockProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
