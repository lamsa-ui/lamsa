import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BadgeComponent, type BadgeVariant } from './badge.component';

@Component({
  imports: [BadgeComponent],
  template: `<ui-badge [variant]="variant()">Paid</ui-badge>`,
})
class HostComponent {
  readonly variant = signal<BadgeVariant>('neutral');
}

describe('BadgeComponent', () => {
  it('shows its text with the variant class, and follows changes', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const badge: HTMLElement = fixture.nativeElement.querySelector('ui-badge');
    expect(badge.textContent?.trim()).toBe('Paid');
    expect(badge.className).toBe('ui-badge ui-badge--neutral');

    fixture.componentInstance.variant.set('success');
    await fixture.whenStable();
    expect(badge.className).toBe('ui-badge ui-badge--success');
  });
});
