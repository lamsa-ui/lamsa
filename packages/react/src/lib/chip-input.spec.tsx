import { fireEvent, render, screen } from '@testing-library/react';
import { ChipInput } from './chip-input.js';

describe('ChipInput', () => {
  it('adds on Enter, skips duplicates, removes and moves focus', () => {
    const onChange = vi.fn();
    render(
      <ChipInput
        label="Toppings"
        defaultValue={['Cheese']}
        onChange={onChange}
      />,
    );
    const field = screen.getByRole('textbox', { name: 'Toppings' });

    (field as HTMLInputElement).value = ' Olives ';
    fireEvent.keyDown(field, { key: 'Enter' });
    (field as HTMLInputElement).value = 'Cheese';
    fireEvent.keyDown(field, { key: ',' });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(['Cheese', 'Olives']);
    expect(screen.getByText('Olives added')).not.toBeNull();

    (field as HTMLInputElement).value = '';
    fireEvent.keyDown(field, { key: 'Backspace' });
    const last = screen.getByRole('button', { name: 'Remove Olives' });
    expect(document.activeElement).toBe(last);

    fireEvent.click(last);
    expect(onChange).toHaveBeenLastCalledWith(['Cheese']);
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Remove Cheese' }),
    );
  });
});
