import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `<button
    ui-button
    [variant]="variant()"
    [loading]="loading()"
    [iconOnly]="iconOnly()"
    data-testid="btn"
  >
    <i ui-button-start data-testid="start"></i>
    Save
    <i ui-button-end data-testid="end"></i>
  </button>`,
})
class HostComponent {
  readonly variant = signal<'primary' | 'danger' | 'outline'>('primary');
  readonly iconOnly = signal(false);
  readonly loading = signal(false);
}

describe('ButtonComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="btn"]',
    );
    return { fixture, button };
  }

  it('applies the variant and size classes to the native button', async () => {
    const { fixture, button } = await setup();
    expect([...button.classList].sort()).toEqual([
      'ui-button',
      'ui-button--md',
      'ui-button--primary',
    ]);

    fixture.componentInstance.variant.set('danger');
    await fixture.whenStable();
    expect(button.classList).toContain('ui-button--danger');
  });

  it('disables the button and marks it busy while loading', async () => {
    const { fixture, button } = await setup();
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute('aria-busy')).toBe(false);

    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.ui-spinner')).not.toBeNull();
    expect(button.textContent?.trim()).toBe('Save');
  });

  it('projects start and end icons around the label', async () => {
    const { button } = await setup();
    const kids = [...button.children].map((c) => c.getAttribute('data-testid'));
    expect(kids).toEqual(['start', 'end']);
    expect(button.firstElementChild?.getAttribute('data-testid')).toBe('start');
  });

  it('supports the outline variant and the icon-only class', async () => {
    const { fixture, button } = await setup();
    fixture.componentInstance.variant.set('outline');
    fixture.componentInstance.iconOnly.set(true);
    await fixture.whenStable();
    expect(button.classList).toContain('ui-button--outline');
    expect(button.classList).toContain('ui-button--icon');
  });
});
