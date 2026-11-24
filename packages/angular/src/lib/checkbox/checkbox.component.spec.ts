import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldsetComponent } from '../fieldset/fieldset.component';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import type { SelectOption } from '../select/select.component';
import { SwitchComponent } from '../switch/switch.component';
import { CheckboxComponent } from './checkbox.component';

@Component({
  imports: [
    CheckboxComponent,
    SwitchComponent,
    RadioGroupComponent,
    FieldsetComponent,
    ReactiveFormsModule,
  ],
  template: `
    <fieldset ui-fieldset legend="Preferences" hint="Change them any time.">
      <ui-checkbox
        label="I accept the terms"
        [error]="error()"
        [formControl]="terms"
        testId="terms"
      />
      <ui-switch
        label="Notifications"
        hint="Sent to your phone"
        [formControl]="notify"
        testId="notify"
      />
      <ui-radio-group
        label="Delivery"
        [options]="speeds"
        [error]="error()"
        [formControl]="speed"
        testId="speed"
      />
    </fieldset>
  `,
})
class HostComponent {
  readonly terms = new FormControl(false, { nonNullable: true });
  readonly notify = new FormControl(true, { nonNullable: true });
  readonly speed = new FormControl<string | null>('std');
  readonly error = signal<string | undefined>(undefined);
  readonly speeds: SelectOption<string>[] = [
    { value: 'std', label: 'Standard' },
    { value: 'exp', label: 'Express' },
    { value: 'same', label: 'Same day', disabled: true },
  ];
}

describe('checkbox, switch, radio group and fieldset', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const get = (id: string) =>
      root.querySelector<HTMLInputElement>(`[data-testid="${id}"]`)!;
    return { fixture, root, get, host: fixture.componentInstance };
  }

  it('names each control by its label', async () => {
    const { root, get } = await setup();
    expect(get('terms').closest('label')?.textContent?.trim()).toBe(
      'I accept the terms',
    );
    expect(get('notify').getAttribute('role')).toBe('switch');
    const group = root.querySelector('[role="radiogroup"]')!;
    expect(
      document.getElementById(group.getAttribute('aria-labelledby')!)
        ?.textContent,
    ).toBe('Delivery');
    const fieldset = root.querySelector('fieldset')!;
    expect(fieldset.querySelector('legend')?.textContent).toBe('Preferences');
    expect(
      document.getElementById(fieldset.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('Change them any time.');
  });

  it('syncs checkbox and switch with their form controls', async () => {
    const { fixture, get, host } = await setup();
    expect(get('terms').checked).toBe(false);
    expect(get('notify').checked).toBe(true);

    get('terms').click();
    get('notify').click();
    expect(host.terms.value).toBe(true);
    expect(host.notify.value).toBe(false);

    host.terms.disable();
    await fixture.whenStable();
    expect(get('terms').disabled).toBe(true);
  });

  it('picks one radio and keeps disabled options out', async () => {
    const { fixture, get, host } = await setup();
    expect(get('speed-0').checked).toBe(true);
    expect(get('speed-2').disabled).toBe(true);
    expect(get('speed-0').name).toBe(get('speed-1').name);

    get('speed-1').click();
    await fixture.whenStable();
    expect(host.speed.value).toBe('exp');

    host.speed.setValue('std');
    await fixture.whenStable();
    expect(get('speed-0').checked).toBe(true);
  });

  it('marks checkbox and radio group invalid and announces the error', async () => {
    const { fixture, root, get, host } = await setup();
    host.error.set('Required');
    await fixture.whenStable();
    expect(get('terms').getAttribute('aria-invalid')).toBe('true');
    expect(
      root.querySelector('[role="radiogroup"]')?.getAttribute('aria-invalid'),
    ).toBe('true');
    expect(root.querySelectorAll('[role="alert"]')).toHaveLength(2);
  });
});
