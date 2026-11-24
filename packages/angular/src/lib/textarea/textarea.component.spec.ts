import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from './textarea.component';

@Component({
  imports: [TextareaComponent, ReactiveFormsModule],
  template: `
    <ui-textarea
      label="Delivery notes"
      hint="Gate code, floor"
      [rows]="4"
      [maxlength]="200"
      [error]="error()"
      [formControl]="notes"
      testId="notes"
    />
  `,
})
class HostComponent {
  readonly notes = new FormControl('Ring twice', { nonNullable: true });
  readonly error = signal<string | undefined>(undefined);
}

describe('TextareaComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const textarea = root.querySelector<HTMLTextAreaElement>(
      '[data-testid="notes"]',
    )!;
    return { fixture, root, textarea };
  }

  it('labels the textarea, links the hint and passes rows and maxlength', async () => {
    const { root, textarea } = await setup();
    expect(root.querySelector('label')?.htmlFor).toBe(textarea.id);
    expect(textarea.getAttribute('aria-describedby')).toBe(
      `${textarea.id}-hint`,
    );
    expect(textarea.rows).toBe(4);
    expect(textarea.maxLength).toBe(200);
  });

  it('syncs its value with the form control both ways', async () => {
    const { fixture, textarea } = await setup();
    expect(textarea.value).toBe('Ring twice');

    textarea.value = 'Leave at the door';
    textarea.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.notes.value).toBe('Leave at the door');

    fixture.componentInstance.notes.disable();
    await fixture.whenStable();
    expect(textarea.disabled).toBe(true);
  });

  it('marks the textarea invalid and announces the error', async () => {
    const { fixture, root, textarea } = await setup();
    fixture.componentInstance.error.set('Too long');
    await fixture.whenStable();
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'Too long',
    );
    expect(textarea.getAttribute('aria-describedby')).toBe(
      `${textarea.id}-hint ${textarea.id}-error`,
    );
  });
});
