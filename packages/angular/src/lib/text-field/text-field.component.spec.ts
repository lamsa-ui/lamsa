import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextFieldComponent } from './text-field.component';

@Component({
  imports: [TextFieldComponent, ReactiveFormsModule],
  template: `
    <ui-text-field
      label="Email"
      hint="Work address"
      [error]="error()"
      [formControl]="email"
      testId="email"
    />
  `,
})
class HostComponent {
  readonly email = new FormControl('a@b.co', { nonNullable: true });
  readonly error = signal<string | undefined>(undefined);
}

describe('TextFieldComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>(
      '[data-testid="email"]',
    )!;
    return { fixture, root, input };
  }

  it('labels the input and links the hint', async () => {
    const { root, input } = await setup();
    expect(root.querySelector('label')?.htmlFor).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toBe(`${input.id}-hint`);
  });

  it('syncs its value with the form control both ways', async () => {
    const { fixture, input } = await setup();
    expect(input.value).toBe('a@b.co');

    input.value = 'new@b.co';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.email.value).toBe('new@b.co');

    fixture.componentInstance.email.setValue('set@b.co');
    await fixture.whenStable();
    expect(input.value).toBe('set@b.co');
  });

  it('follows the control disabled state', async () => {
    const { fixture, input } = await setup();
    fixture.componentInstance.email.disable();
    await fixture.whenStable();
    expect(input.disabled).toBe(true);
  });

  it('marks the input invalid and announces the error', async () => {
    const { fixture, root, input } = await setup();
    fixture.componentInstance.error.set('Enter a valid email');
    await fixture.whenStable();

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(
      `${input.id}-hint ${input.id}-error`,
    );
    expect(root.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'Enter a valid email',
    );
  });
});
