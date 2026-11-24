import { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, type SelectOption } from './select.js';

const cities: SelectOption<string>[] = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
  { value: 'asw', label: 'Aswan', disabled: true },
];

describe('Select', () => {
  it('shows the placeholder on a collapsed listbox button', () => {
    render(
      <Select
        label="City"
        placeholder="Choose a city"
        options={cities}
        testId="city"
      />,
    );
    const trigger = screen.getByTestId('city');
    expect(trigger.textContent).toContain('Choose a city');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('opens the list and reports the picked option', async () => {
    const onChange = vi.fn();
    render(
      <Select
        label="City"
        placeholder="Choose a city"
        options={cities}
        onChange={onChange}
        testId="city"
      />,
    );
    await userEvent.click(screen.getByTestId('city'));

    expect(screen.getByRole('listbox')).not.toBeNull();
    expect(
      screen.getByTestId('city-option-2').getAttribute('aria-disabled'),
    ).toBe('true');

    await userEvent.click(screen.getByRole('option', { name: 'Alexandria' }));

    expect(onChange).toHaveBeenCalledWith('alx');
    expect(screen.getByTestId('city').textContent).toContain('Alexandria');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('moves through options with the keyboard and closes on Escape', async () => {
    render(<Select label="City" options={cities} testId="city" />);
    const trigger = screen.getByTestId('city');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');

    const active = document.activeElement as HTMLElement;
    expect(active.getAttribute('role')).toBe('option');
    expect(active.className).toContain('ui-option--active');

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('marks the field invalid and announces the error', () => {
    render(
      <Select
        label="Size"
        options={cities}
        error="Choose a size"
        testId="size"
      />,
    );
    const trigger = screen.getByTestId('size');
    expect(trigger.closest('.ui-field')?.classList).toContain(
      'ui-field--invalid',
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe('Choose a size');
    expect(trigger.getAttribute('aria-describedby')?.split(' ')).toContain(
      alert.id,
    );
  });

  it('exposes blur and the trigger ref for form libraries', () => {
    const onBlur = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Select
        label="City"
        options={cities}
        onBlur={onBlur}
        ref={ref}
        testId="city"
      />,
    );

    const trigger = screen.getByTestId('city');
    expect(ref.current).toBe(trigger);
    fireEvent.blur(trigger);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
