import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TimelineComponent, type TimelineItem } from './timeline.component';

@Component({
  imports: [TimelineComponent],
  template: `<ui-timeline label="Approval history" [items]="items" />`,
})
class HostComponent {
  readonly items: TimelineItem[] = [
    {
      title: 'Manager review',
      actor: 'Hatem Mohamed',
      date: '20 Nov 2026, 14:30',
      dateTime: '2026-11-20T14:30:00Z',
      description: 'Budget and documents verified.',
      status: 'approved',
    },
    {
      title: 'Finance review',
      date: 'Awaiting review',
      status: 'pending',
      statusLabel: 'Waiting',
    },
  ];
}

describe('TimelineComponent', () => {
  it('shows approval events, status, actor, and semantic dates', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('ol')?.getAttribute('aria-label')).toBe(
      'Approval history',
    );
    expect(el.querySelector('h3')?.textContent?.trim()).toBe('Manager review');
    expect(el.textContent).toContain('Hatem Mohamed');
    expect(el.textContent).toContain('Budget and documents verified.');
    expect(el.textContent).toContain('Approved');
    expect(el.textContent).toContain('Waiting');
    expect(el.querySelector('time')?.getAttribute('datetime')).toBe(
      '2026-11-20T14:30:00Z',
    );
    expect(el.querySelectorAll('time')[1].getAttribute('datetime')).toBeNull();
  });
});
