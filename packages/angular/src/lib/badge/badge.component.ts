import { Component, computed, input } from '@angular/core';

export type BadgeVariant =
  'neutral' | 'info' | 'success' | 'warning' | 'danger';

/**
 * A short status label. The text carries the meaning; the colour only repeats it,
 * so write the status in words ("Paid", "Late"), never colour alone.
 *
 * ```html
 * <ui-badge variant="success">Paid</ui-badge>
 * ```
 */
@Component({
  selector: 'ui-badge',
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');

  protected readonly classes = computed(
    () => `ui-badge ui-badge--${this.variant()}`,
  );
}
