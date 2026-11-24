import { Component, computed, input } from '@angular/core';

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/**
 * A coloured dot before the word for a status: "Online", "Busy". The word carries the
 * meaning, so it is always there; the dot only repeats it.
 *
 * ```html
 * <ui-status-dot tone="success">Online</ui-status-dot>
 * ```
 */
@Component({
  selector: 'ui-status-dot',
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class StatusDotComponent {
  readonly tone = input<StatusTone>('neutral');

  protected readonly classes = computed(() =>
    this.tone() === 'neutral'
      ? 'ui-status-dot'
      : `ui-status-dot ui-status-dot--${this.tone()}`,
  );
}
