import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CalendarComponent, type DateRange } from './calendar.component';

@Component({
  imports: [CalendarComponent],
  template: `
    <ui-calendar
      label="Delivery"
      locale="en-GB"
      [(value)]="day"
      min="2026-11-03"
    />
    <ui-calendar
      label="Stay"
      locale="en-GB"
      selection="range"
      [(range)]="stay"
    />
  `,
})
class HostComponent {
  readonly day = signal<string | null>('2026-11-19');
  readonly stay = signal<DateRange | null>(null);
}

const day = (root: Element, iso: string) =>
  root.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)!;

describe('CalendarComponent', () => {
  it('shows the month, names each day and moves with the keyboard', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const [single] = fixture.nativeElement.querySelectorAll('ui-calendar');

    expect(single.querySelector('h2').textContent.trim()).toBe('November 2026');
    // en-GB weeks start on Monday; 1 November 2026 is a Sunday.
    expect(single.querySelector('th').getAttribute('abbr')).toBe('Monday');
    expect(
      single
        .querySelectorAll('tbody tr')[0]
        .querySelectorAll('td')[6]
        .textContent.trim(),
    ).toBe('1');
    const picked = day(single, '2026-11-19');
    expect(picked.getAttribute('aria-label')).toBe(
      'Thursday, 19 November 2026',
    );
    expect(picked.tabIndex).toBe(0);
    expect(picked.closest('td')!.getAttribute('aria-selected')).toBe('true');
    expect(day(single, '2026-11-02').getAttribute('aria-disabled')).toBe(
      'true',
    );

    picked.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    await fixture.whenStable();
    expect(day(single, '2026-11-26').tabIndex).toBe(0);

    day(single, '2026-11-26').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }),
    );
    await fixture.whenStable();
    expect(single.querySelector('h2').textContent.trim()).toBe('December 2026');

    day(single, '2026-12-01').click();
    expect(fixture.componentInstance.day()).toBe('2026-12-01');

    // Before min: nothing changes, and the month can't go back past it.
    single.querySelector('[aria-label="Previous month"]').click();
    await fixture.whenStable();
    day(single, '2026-11-02').click();
    expect(fixture.componentInstance.day()).toBe('2026-12-01');
    expect(single.querySelector('[aria-label="Previous month"]').disabled).toBe(
      true,
    );
  });

  it('picks a range in either order', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const range = fixture.nativeElement.querySelectorAll('ui-calendar')[1];
    const month = fixture.componentInstance; // today's month is shown
    const [a, b, c] = Array.from(
      range.querySelectorAll('.ui-calendar__day'),
    ).slice(9, 12) as HTMLButtonElement[];

    c.click();
    a.click();
    await fixture.whenStable();
    expect(month.stay()).toEqual({
      start: a.dataset['date'],
      end: c.dataset['date'],
    });
    expect(b.classList).toContain('ui-calendar__day--in-range');
    expect(a.classList).toContain('ui-calendar__day--selected');
    expect(b.closest('td')!.getAttribute('aria-selected')).toBe('true');
  });
});
