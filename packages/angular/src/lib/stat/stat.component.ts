import { Component, computed, input } from '@angular/core';
import type { IconName } from '@ghazal-ui/icons';
import { IconComponent } from '../icon/icon.component';

export type StatTrend = 'up' | 'down' | 'flat';
export type StatTone = 'positive' | 'negative' | 'neutral';

/**
 * One number with its label, and how it changed. Write the change so it reads alone
 * ("+12% on last month"); the arrow and colour only repeat it. `tone` is separate from
 * `trend` because up is not always good: rising costs are `trend="up" tone="negative"`.
 *
 * ```html
 * <ui-stat label="Revenue" value="EGP 84,200" change="+12% on last month" trend="up" tone="positive" />
 * ```
 */
/** Up, down or level: the arrow repeats what the words say. */
const TREND_ICONS: Record<StatTrend, IconName> = {
  up: 'arrow-up',
  down: 'arrow-down',
  flat: 'minus',
};

@Component({
  imports: [IconComponent],
  selector: 'ui-stat',
  host: { class: 'ui-stat' },
  template: `
    <p class="ui-stat__label">{{ label() }}</p>
    <p class="ui-stat__value">{{ value() }}</p>
    @if (change()) {
      <p [class]="changeClasses()">
        @if (trend(); as trend) {
          <ui-icon [name]="trendIcons[trend]" />
        }
        {{ change() }}
      </p>
    }
  `,
})
export class StatComponent {
  protected readonly trendIcons = TREND_ICONS;

  readonly label = input.required<string>();
  readonly value = input.required<string>();
  /** How it changed, in words or with a sign: "+12% on last month". */
  readonly change = input<string>();
  /** The arrow beside the change. */
  readonly trend = input<StatTrend>();
  /** The colour of the change: good, bad or neither. */
  readonly tone = input<StatTone>('neutral');

  protected readonly changeClasses = computed(() =>
    this.tone() === 'neutral'
      ? 'ui-stat__change'
      : `ui-stat__change ui-stat__change--${this.tone()}`,
  );
}
