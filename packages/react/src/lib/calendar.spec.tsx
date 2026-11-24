import { fireEvent, render, screen, within } from '@testing-library/react';
import { I18nProvider } from 'react-aria-components';
import { Calendar, RangeCalendar } from './calendar.js';

describe('Calendar', () => {
  it('names each day, marks the picked one and returns ISO dates', () => {
    const onChange = vi.fn();
    const { container } = render(
      <I18nProvider locale="en-GB">
        <Calendar
          label="Delivery"
          defaultValue="2026-11-19"
          min="2026-11-03"
          onChange={onChange}
        />
      </I18nProvider>,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(
      'November 2026',
    );
    const picked = container.querySelector('.ui-calendar__day--selected')!;
    expect(picked.textContent).toBe('19');
    expect(
      container.querySelector('.ui-calendar__day--disabled'),
    ).not.toBeNull();
    fireEvent.click(within(screen.getByRole('grid')).getByText('20'));
    expect(onChange).toHaveBeenCalledWith('2026-11-20');
  });

  it('fills a range between its two ends', () => {
    const { container } = render(
      <RangeCalendar
        label="Stay"
        defaultValue={{ start: '2026-11-10', end: '2026-11-13' }}
      />,
    );
    expect(
      container.querySelectorAll('.ui-calendar__day--selected'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('.ui-calendar__day--in-range'),
    ).toHaveLength(2);
  });
});
