import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { TextFieldComponent } from './text-field/text-field.component';
import { FormField, form, required } from '@angular/forms/signals';

@Component({
  imports: [FormField, TextFieldComponent, CheckboxComponent],
  template: `
    <ui-text-field
      label="Name"
      [formField]="profileForm.name"
      [error]="
        profileForm.name().touched() && profileForm.name().invalid()
          ? 'Name is required'
          : undefined
      "
      testId="name"
    />
    <ui-checkbox
      label="Accept terms"
      [formField]="profileForm.accepted"
      testId="accepted"
    />
  `,
})
class SignalFormsHost {
  readonly model = signal({ name: '', accepted: false });
  readonly profileForm = form(this.model, (path) => {
    required(path.name, { message: 'Name is required' });
  });
}

describe('Signal Forms controls', () => {
  it('connects values, validation state, and touch while retaining native UI', async () => {
    const fixture = TestBed.createComponent(SignalFormsHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const name = root.querySelector<HTMLInputElement>('[data-testid="name"]')!;
    const accepted = root.querySelector<HTMLInputElement>(
      '[data-testid="accepted"]',
    )!;

    expect(name.value).toBe('');
    expect(root.querySelector('[role="alert"]')).toBeNull();

    name.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(root.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'Name is required',
    );

    name.value = 'Ada';
    name.dispatchEvent(new Event('input'));
    accepted.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.model()).toEqual({
      name: 'Ada',
      accepted: true,
    });

    fixture.componentInstance.model.set({ name: 'Grace', accepted: false });
    await fixture.whenStable();
    expect(name.value).toBe('Grace');
    expect(accepted.checked).toBe(false);
  });
});
