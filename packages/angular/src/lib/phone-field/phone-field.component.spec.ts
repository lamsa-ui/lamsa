import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PhoneFieldComponent } from './phone-field.component';

@Component({
  imports: [PhoneFieldComponent, ReactiveFormsModule],
  template: `
    <ui-phone-field label="Mobile" testId="phone" [formControl]="phone" />
  `,
})
class HostComponent {
  readonly phone = new FormControl<string | null>('+966501234567');
}

async function setup() {
  const fixture = TestBed.createComponent(HostComponent);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  return { fixture, root, host: fixture.componentInstance };
}

describe('PhoneFieldComponent', () => {
  it('opens a listbox and changes the country without losing the national number', async () => {
    const { fixture, root, host } = await setup();
    const trigger = root.querySelector<HTMLButtonElement>(
      '[data-testid="phone-country"]',
    )!;
    const input = root.querySelector<HTMLInputElement>(
      '[data-testid="phone"]',
    )!;

    expect(trigger.textContent).toContain('🇸🇦');
    expect(trigger.textContent).toContain('Saudi Arabia +966');
    expect(input.value).toBe('501234567');
    trigger.click();
    await fixture.whenStable();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('[role="listbox"]')).not.toBeNull();
    const egyptOption = document.querySelector<HTMLElement>(
      '[data-testid="phone-country-option-0"]',
    )!;
    expect(egyptOption.textContent).toContain('🇪🇬');
    egyptOption.click();
    await fixture.whenStable();

    expect(host.phone.value).toBe('+20501234567');
    expect(input.value).toBe('501234567');
    expect(trigger.textContent).toContain('Egypt +20');
    expect(trigger.textContent).toContain('🇪🇬');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on Escape and disables the picker with the field', async () => {
    const { fixture, root, host } = await setup();
    const trigger = root.querySelector<HTMLButtonElement>(
      '[data-testid="phone-country"]',
    )!;
    trigger.click();
    await fixture.whenStable();
    document
      .querySelector('[role="listbox"]')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
    await fixture.whenStable();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    host.phone.disable();
    await fixture.whenStable();
    expect(trigger.disabled).toBe(true);
  });
});
