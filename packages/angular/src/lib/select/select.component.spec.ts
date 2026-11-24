import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent, SelectOption } from './select.component';

@Component({
  imports: [SelectComponent, ReactiveFormsModule],
  template: `<ui-select
    label="City"
    placeholder="Choose a city"
    [options]="cities"
    [formControl]="city"
    testId="city"
  />`,
})
class HostComponent {
  readonly cities: SelectOption<string>[] = [
    { value: 'cai', label: 'Cairo' },
    { value: 'alx', label: 'Alexandria' },
    { value: 'asw', label: 'Aswan', disabled: true },
  ];
  readonly city = new FormControl<string | null>(null);
}

describe('SelectComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const trigger = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLButtonElement>('[data-testid="city"]')!;
    const option = (index: number) =>
      document.querySelector<HTMLElement>(
        `[data-testid="city-option-${index}"]`,
      );
    return { fixture, trigger, option };
  }

  it('shows the placeholder and a collapsed listbox trigger', async () => {
    const { trigger, option } = await setup();
    expect(trigger.textContent).toContain('Choose a city');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(option(0)).toBeNull();
  });

  it('opens the listbox and writes the picked option to the form control', async () => {
    const { fixture, trigger, option } = await setup();
    trigger.click();
    await fixture.whenStable();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('[role="listbox"]')).not.toBeNull();
    expect(option(2)?.getAttribute('aria-disabled')).toBe('true');

    option(1)!.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.city.value).toBe('alx');
    expect(trigger.textContent).toContain('Alexandria');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('marks the keyboard-active option with the kit class', async () => {
    const { fixture, trigger, option } = await setup();
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    await fixture.whenStable();
    const listbox = document.querySelector<HTMLElement>('[role="listbox"]')!;
    listbox.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    await fixture.whenStable();

    const active = document.querySelectorAll('.ui-option--active');
    expect(active).toHaveLength(1);
    expect([option(0), option(1)]).toContain(active[0]);
  });

  it('shows a value set from the form control', async () => {
    const { fixture, trigger } = await setup();
    fixture.componentInstance.city.setValue('cai');
    await fixture.whenStable();
    expect(trigger.textContent).toContain('Cairo');
  });
});
