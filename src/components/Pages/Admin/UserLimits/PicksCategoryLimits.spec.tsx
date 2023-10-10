import { render } from '@testing-library/react';
import { PicksCategoryLimits } from './PicksCategoryLimits';
import { picksCategoryLimitMock } from './__mocks__/picksCategoryLimitMock';

describe('PicksCategoryLimits', () => {
  it('should render correctly', () => {
    const { container } = render(
      <PicksCategoryLimits
        onSubmit={jest.fn()}
        defaultValues={picksCategoryLimitMock}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
