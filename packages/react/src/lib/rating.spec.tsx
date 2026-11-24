import { fireEvent, render, screen } from '@testing-library/react';
import { Rating } from './rating.js';

describe('Rating', () => {
  it('is a group of radios named per star', () => {
    const onChange = vi.fn();
    render(<Rating label="Food" onChange={onChange} />);
    expect(screen.getByRole('group', { name: 'Food' })).not.toBeNull();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    fireEvent.click(screen.getByRole('radio', { name: '3 stars' }));
    expect(onChange).toHaveBeenCalledWith(3);
    expect(
      (screen.getByRole('radio', { name: '3 stars' }) as HTMLInputElement)
        .checked,
    ).toBe(true);
  });

  it('shows a read-only score as one image', () => {
    const { container } = render(<Rating value={4.5} readOnly />);
    expect(screen.getByRole('img', { name: '4.5 out of 5 stars' }));
    expect(container.querySelectorAll('.ui-rating__star--on')).toHaveLength(5);
    expect(screen.queryByRole('radio')).toBeNull();
  });
});
