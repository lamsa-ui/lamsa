import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppShellComponent } from '../app-shell/app-shell.component';
import type { DateRange } from '../calendar/calendar.component';
import { DatePickerComponent } from './date-picker.component';

@Component({
  imports: [ReactiveFormsModule, DatePickerComponent, AppShellComponent],
  template: `
    <ui-date-picker
      label="Delivery day"
      testId="day"
      min="2026-11-02"
      [formControl]="day"
    />
    <ui-date-picker
      label="Stay"
      selection="range"
      testId="stay"
      [(range)]="stay"
    />
    <ui-app-shell [landmarks]="false">
      <a uiShellBrand class="ui-shell__brand" href="/">Lamsa</a>
      <nav uiShellSidebar aria-label="Main">
        <a href="#orders" data-testid="orders">Orders</a>
      </nav>
      <p>Page</p>
    </ui-app-shell>
  `,
})
class HostComponent {
  readonly day = new FormControl<string | null>('2026-11-10');
  readonly stay = signal<DateRange | null>(null);
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  return { fixture, root, host: fixture.componentInstance };
}

describe('DatePickerComponent', () => {
  it('types an ISO date into the native field', async () => {
    const { fixture, root, host } = await setup();
    const input = root.querySelector<HTMLInputElement>('[data-testid="day"]')!;
    expect(input.type).toBe('date');
    expect(input.value).toBe('2026-11-10');
    expect(input.min).toBe('2026-11-02');
    input.value = '2026-11-12';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.day.value).toBe('2026-11-12');
  });

  it('opens a calendar on the picked day and closes on a pick', async () => {
    const { fixture, root, host } = await setup();
    const button = root
      .querySelectorAll('ui-date-picker')[0]
      .querySelector<HTMLButtonElement>('[aria-label="Choose date"]')!;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const panel = document.querySelector('.ui-date-picker__popover')!;
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(document.activeElement?.getAttribute('data-date')).toBe(
      '2026-11-10',
    );
    expect(
      panel
        .querySelector('[data-date="2026-11-01"]')!
        .getAttribute('aria-disabled'),
    ).toBe('true');

    panel.querySelector<HTMLButtonElement>('[data-date="2026-11-20"]')!.click();
    await fixture.whenStable();
    expect(host.day.value).toBe('2026-11-20');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('types both endpoints and completes a range from the calendar', async () => {
    const { fixture, root, host } = await setup();
    const start = root.querySelector<HTMLInputElement>(
      '[data-testid="stay-start"]',
    )!;
    const end = root.querySelector<HTMLInputElement>(
      '[data-testid="stay-end"]',
    )!;
    expect(start.getAttribute('aria-label')).toBe('Stay: Start date');
    expect(end.disabled).toBe(true);

    start.value = '2026-11-10';
    start.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.stay()).toEqual({ start: '2026-11-10', end: null });
    expect(end.disabled).toBe(false);

    end.value = '2026-11-14';
    end.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.stay()).toEqual({ start: '2026-11-10', end: '2026-11-14' });

    const button = root
      .querySelectorAll('ui-date-picker')[1]
      .querySelector<HTMLButtonElement>('[aria-label="Choose date"]')!;
    button.click();
    await fixture.whenStable();
    const panel = document.querySelector('.ui-date-picker__popover')!;
    const days = Array.from(
      panel.querySelectorAll<HTMLButtonElement>('.ui-calendar__day'),
    );
    const first = days.find(
      (day) => day.getAttribute('aria-disabled') !== 'true',
    )!;
    const second = days.find(
      (day) =>
        day.getAttribute('aria-disabled') !== 'true' &&
        day.dataset['date'] !== first.dataset['date'],
    )!;
    first.click();
    await fixture.whenStable();
    expect(document.querySelector('.ui-date-picker__popover')).not.toBeNull();
    second.click();
    await fixture.whenStable();
    expect(host.stay()).toEqual({
      start: first.dataset['date'],
      end: second.dataset['date'],
    });
    expect(document.querySelector('.ui-date-picker__popover')).toBeNull();
  });
});

describe('AppShellComponent', () => {
  it('opens the side bar from the menu button and closes it on a link or Escape', async () => {
    const { fixture, root } = await setup();
    const shell = root.querySelector<HTMLElement>('ui-app-shell')!;
    const menu = root.querySelector<HTMLButtonElement>('.ui-shell__menu')!;
    const sidebar = root.querySelector<HTMLElement>('.ui-shell__sidebar')!;
    expect(menu.getAttribute('aria-controls')).toBe(sidebar.id);
    expect(shell.querySelector('[role="banner"], [role="main"]')).toBeNull();

    menu.click();
    await fixture.whenStable();
    expect(shell.classList).toContain('ui-shell--open');
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.getAttribute('data-testid')).toBe('orders');

    root.querySelector<HTMLElement>('[data-testid="orders"]')!.click();
    await fixture.whenStable();
    expect(shell.classList).not.toContain('ui-shell--open');

    menu.click();
    await fixture.whenStable();
    sidebar.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(shell.classList).not.toContain('ui-shell--open');
    expect(document.activeElement).toBe(menu);
  });
});
