import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { SelectOption } from '../select/select.component';
import { ComboboxComponent } from './combobox.component';

@Component({
  imports: [ComboboxComponent, ReactiveFormsModule],
  template: `<ui-combobox
    label="Country"
    [options]="countries"
    [formControl]="country"
    testId="country"
  />`,
})
class HostComponent {
  readonly countries: SelectOption<string>[] = [
    { value: 'eg', label: 'Egypt' },
    { value: 'ae', label: 'United Arab Emirates' },
    { value: 'sa', label: 'Saudi Arabia', disabled: true },
    { value: 'gb', label: 'United Kingdom' },
  ];
  readonly country = new FormControl<string | null>(null);
}

describe('ComboboxComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const field = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLInputElement>('[data-testid="country"]')!;
    const key = async (key: string) => {
      field.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      await fixture.whenStable();
    };
    const type = async (text: string) => {
      field.value = text;
      field.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const options = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));
    return { fixture, field, key, type, options };
  }

  it('is a collapsed combobox named by its label', async () => {
    const { fixture, field } = await setup();
    const label = (fixture.nativeElement as HTMLElement).querySelector('label');
    expect(label?.htmlFor).toBe(field.id);
    expect(field.getAttribute('role')).toBe('combobox');
    expect(field.getAttribute('aria-expanded')).toBe('false');
  });

  it('filters as you type and says when nothing matches', async () => {
    const { field, type, options } = await setup();
    await type('unit');
    expect(field.getAttribute('aria-expanded')).toBe('true');
    expect(options().map((o) => o.textContent?.trim())).toEqual([
      'United Arab Emirates',
      'United Kingdom',
    ]);

    await type('zz');
    expect(options()).toHaveLength(0);
    expect(document.querySelector('[role="status"]')?.textContent).toContain(
      'No matches',
    );
  });

  it('moves with the arrow keys past disabled options and picks with Enter', async () => {
    const { fixture, field, key, options } = await setup();
    await key('ArrowDown');
    await key('ArrowDown');
    await key('ArrowDown');
    // Egypt, Emirates, then Saudi Arabia is disabled, so United Kingdom.
    const active = document.getElementById(
      field.getAttribute('aria-activedescendant')!,
    );
    expect(active?.textContent?.trim()).toBe('United Kingdom');
    expect(active?.classList).toContain('ui-option--active');
    expect(options()[2].getAttribute('aria-disabled')).toBe('true');

    await key('Enter');
    expect(fixture.componentInstance.country.value).toBe('gb');
    expect(field.value).toBe('United Kingdom');
    expect(field.getAttribute('aria-expanded')).toBe('false');
  });

  it('puts the chosen label back when the field is left with other text, and clears when emptied', async () => {
    const { fixture, field, type } = await setup();
    fixture.componentInstance.country.setValue('eg');
    await fixture.whenStable();
    expect(field.value).toBe('Egypt');

    await type('Egy');
    field.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(field.value).toBe('Egypt');

    await type('');
    field.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.country.value).toBeNull();
  });

  it('closes on Escape', async () => {
    const { field, key } = await setup();
    await key('ArrowDown');
    expect(field.getAttribute('aria-expanded')).toBe('true');
    await key('Escape');
    expect(field.getAttribute('aria-expanded')).toBe('false');
  });
});
