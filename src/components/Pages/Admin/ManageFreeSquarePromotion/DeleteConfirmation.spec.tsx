import { render } from '@testing-library/react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { mockDeleteProps } from './__mocks__/mockDeleteProps';

describe('DeleteConfirmationDialog', () => {
  it('should render correctly', () => {
    const { container } = render(
      <DeleteConfirmationDialog {...mockDeleteProps} />,
    );
    expect(container).toMatchSnapshot();
  });
});
