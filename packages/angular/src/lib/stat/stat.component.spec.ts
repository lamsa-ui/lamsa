import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DividerComponent } from '../divider/divider.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { TagComponent } from '../tag/tag.component';
import { StatComponent } from './stat.component';

@Component({
  imports: [StatComponent, DividerComponent, EmptyStateComponent, TagComponent],
  template: `
    <ui-stat
      label="Costs"
      value="EGP 9,000"
      change="+4%"
      trend="up"
      tone="negative"
    />
    <ui-stat label="Orders" value="18" />
    <ui-divider />
    <ui-divider orientation="vertical" />
    <ui-divider label="or" />
    <ui-empty-state title="No orders yet" [level]="2"
      ><p>Soon.</p></ui-empty-state
    >
    <ui-tag
      removable
      removeLabel="Remove filter"
      (remove)="removed = removed + 1"
      >Angular</ui-tag
    >
    <ui-tag>Plain</ui-tag>
  `,
})
class HostComponent {
  removed = 0;
}

describe('content components', () => {
  it('render the right roles, classes and names', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const [costs, orders] = Array.from(el.querySelectorAll('ui-stat'));
    expect(costs.querySelector('.ui-stat__change')!.className).toBe(
      'ui-stat__change ui-stat__change--negative',
    );
    const arrow = costs.querySelector('ui-icon')!;
    expect(arrow.getAttribute('aria-hidden')).toBe('true');
    expect(arrow.querySelector('svg')!.innerHTML).toContain('M12 19V5');
    expect(orders.querySelector('.ui-stat__change')).toBeNull();

    const [line, vertical, labelled] = Array.from(
      el.querySelectorAll('ui-divider'),
    );
    expect(line.getAttribute('role')).toBe('separator');
    expect(line.getAttribute('aria-orientation')).toBeNull();
    expect(vertical.getAttribute('aria-orientation')).toBe('vertical');
    expect(labelled.getAttribute('role')).toBeNull();
    expect(labelled.className).toBe('ui-divider ui-divider--label');

    expect(el.querySelector('ui-empty-state h2')!.textContent).toBe(
      'No orders yet',
    );

    const [removable, plain] = Array.from(el.querySelectorAll('ui-tag'));
    const button = removable.querySelector('button')!;
    const names = button
      .getAttribute('aria-labelledby')!
      .split(' ')
      .map((id) => {
        const target = el.querySelector(`[id="${id}"]`)!;
        return target === button
          ? button.getAttribute('aria-label')
          : target.textContent;
      });
    expect(names.join(' ')).toBe('Remove filter Angular');
    button.click();
    expect(fixture.componentInstance.removed).toBe(1);
    expect(plain.querySelector('button')).toBeNull();
  });
});
