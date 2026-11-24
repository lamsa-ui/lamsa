import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from 'react-aria-components';
import { AppShell } from './app-shell.js';
import { DatePicker } from './date-picker.js';
import { NumberField, SearchField } from './fields.js';
import { PhoneField } from './phone-field.js';
import { PinInput } from './pin-input.js';
import { SegmentedControl } from './segmented-control.js';

describe('SearchField', () => {
  it('keeps a hidden label, clears with Escape and searches on Enter', async () => {
    const onSearch = vi.fn();
    const onChange = vi.fn();
    render(
      <SearchField
        label="Search orders"
        hideLabel
        onChange={onChange}
        onSearch={onSearch}
      />,
    );
    const input = screen.getByRole('searchbox', { name: 'Search orders' });
    expect(screen.getByText('Search orders').className).toContain(
      'ui-visually-hidden',
    );
    expect(screen.queryByRole('button')).toBeNull();
    await userEvent.type(input, 'order 1042{Enter}');
    expect(onSearch).toHaveBeenCalledWith('order 1042');
    expect(screen.getByRole('button', { name: 'Clear search' })).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    expect(onChange).toHaveBeenLastCalledWith('');
  });
});

describe('NumberField', () => {
  it('steps within min and max and reports null when emptied', async () => {
    const onChange = vi.fn();
    render(
      <NumberField
        label="Guests"
        min={1}
        max={3}
        defaultValue={2}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Guests' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(3);
    const plus = screen.getByRole('button', { name: /Increase/ });
    expect(plus.hasAttribute('disabled')).toBe(true);
    await userEvent.clear(input);
    await userEvent.tab();
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});

describe('DatePicker', () => {
  it('types in segments and picks from a calendar', async () => {
    const onChange = vi.fn();
    render(
      <I18nProvider locale="en-GB">
        <DatePicker
          label="Delivery day"
          defaultValue="2026-11-10"
          min="2026-11-02"
          onChange={onChange}
        />
      </I18nProvider>,
    );
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThanOrEqual(3);
    await userEvent.click(screen.getByRole('button', { name: /Calendar/ }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByText('20'));
    expect(onChange).toHaveBeenCalledWith('2026-11-20');
  });

  it('shows two date fields and picks a range from the calendar', async () => {
    const onChange = vi.fn();
    render(
      <I18nProvider locale="en-GB">
        <DatePicker
          label="Stay"
          selection="range"
          defaultValue={{ start: '2026-11-10', end: '2026-11-12' }}
          onChange={onChange}
        />
      </I18nProvider>,
    );
    expect(screen.getAllByRole('spinbutton')).toHaveLength(6);

    await userEvent.click(screen.getByRole('button', { name: /Calendar/ }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByText('15'));
    await userEvent.click(within(dialog).getByText('20'));
    expect(onChange).toHaveBeenLastCalledWith({
      start: '2026-11-15',
      end: '2026-11-20',
    });
  });
});

describe('PhoneField', () => {
  it('splits a stored number and writes E.164 from Arabic digits', async () => {
    const onChange = vi.fn();
    render(
      <PhoneField
        label="Mobile"
        testId="phone"
        name="phone"
        defaultValue="+966501234567"
        onChange={onChange}
      />,
    );
    const country = screen.getByTestId<HTMLButtonElement>('phone-country');
    const input = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'Mobile',
    });
    expect(country.textContent).toContain('🇸🇦');
    expect(country.textContent).toContain('Saudi Arabia +966');
    expect(input.value).toBe('501234567');
    await userEvent.click(country);
    const egyptOption = await screen.findByRole('option', {
      name: 'Egypt +20',
    });
    expect(egyptOption.textContent).toContain('🇪🇬');
    await userEvent.click(egyptOption);
    expect(
      document.querySelector<HTMLInputElement>('input[name="phone"]')?.value,
    ).toBe('+20501234567');
    fireEvent.change(input, { target: { value: '٠١٠ ١٢٣٤ ٥٦٧٨' } });
    expect(onChange).toHaveBeenLastCalledWith('+201012345678');
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('closes the country list on Escape and returns focus to its trigger', async () => {
    render(<PhoneField label="Mobile" testId="phone" />);
    const country = screen.getByTestId<HTMLButtonElement>('phone-country');

    await userEvent.click(country);
    expect(await screen.findByRole('listbox')).not.toBeNull();
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(country));
  });
});

describe('PinInput', () => {
  it('moves on as digits are typed and fills every box from a paste', async () => {
    const onComplete = vi.fn();
    render(
      <PinInput label="Code" length={4} testId="pin" onComplete={onComplete} />,
    );
    expect(screen.getByRole('group', { name: 'Code' })).not.toBeNull();
    const cells = [0, 1, 2, 3].map((i) =>
      screen.getByTestId<HTMLInputElement>(`pin-${i}`),
    );
    expect(cells[0].getAttribute('autocomplete')).toBe('one-time-code');
    expect(cells[2].getAttribute('aria-label')).toBe('Digit 3 of 4');

    await userEvent.click(cells[0]);
    await userEvent.keyboard('4');
    expect(document.activeElement).toBe(cells[1]);
    await userEvent.keyboard('x');
    expect(cells[1].value).toBe('');

    act(() => cells[0].focus());
    fireEvent.change(cells[0], { target: { value: '٤٢٧١' } });
    expect(cells.map((c) => c.value).join('')).toBe('4271');
    expect(onComplete).toHaveBeenCalledWith('4271');

    fireEvent.change(cells[3], { target: { value: '' } });
    fireEvent.keyDown(cells[3], { key: 'Backspace' });
    expect(document.activeElement).toBe(cells[2]);
    expect(cells[2].value).toBe('');
  });
});

describe('SegmentedControl', () => {
  it('is a named radio group', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="View"
        iconOnly
        defaultValue="list"
        onChange={onChange}
        options={[
          { value: 'list', label: 'List', icon: 'list' },
          { value: 'grid', label: 'Grid', icon: 'layout-grid' },
        ]}
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'View' });
    expect(
      (within(group).getByRole('radio', { name: 'List' }) as HTMLInputElement)
        .checked,
    ).toBe(true);
    fireEvent.click(within(group).getByRole('radio', { name: 'Grid' }));
    expect(onChange).toHaveBeenCalledWith('grid');
  });
});

describe('AppShell', () => {
  it('opens the side bar from the menu button and closes it on a link or Escape', async () => {
    const { container } = render(
      <AppShell
        landmarks={false}
        brand={<span>Lamsa</span>}
        sidebar={
          <nav aria-label="Main">
            <a href="#orders">Orders</a>
          </nav>
        }
      >
        <p>Page</p>
      </AppShell>,
    );
    const shell = container.querySelector('.ui-shell')!;
    const menu = screen.getByRole('button', { name: 'Menu' });
    expect(screen.queryByRole('banner')).toBeNull();
    await userEvent.click(menu);
    expect(shell.classList).toContain('ui-shell--open');
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toBe('Orders');

    fireEvent.click(screen.getByText('Orders'));
    expect(shell.classList).not.toContain('ui-shell--open');

    await userEvent.click(menu);
    await userEvent.keyboard('{Escape}');
    expect(shell.classList).not.toContain('ui-shell--open');
    expect(document.activeElement).toBe(menu);
  });
});
