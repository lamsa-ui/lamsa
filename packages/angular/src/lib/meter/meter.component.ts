import { Component, computed, input } from '@angular/core';

let nextId = 0;

export type MeterTone = 'neutral' | 'success' | 'warning' | 'danger';

/**
 * A level inside a known range, such as storage used or a score: not work in progress
 * (that is a progress bar). The value is written beside the label; the tone only repeats it.
 *
 * ```html
 * <ui-meter label="Storage" [value]="72" valueText="7.2 of 10 GB" tone="warning" />
 * ```
 */
@Component({
  selector: 'ui-meter',
  host: { '[class]': 'classes()' },
  template: `
    <div class="ui-meter__head">
      <span class="ui-meter__label" [id]="id">{{ label() }}</span>
      <span class="ui-meter__value" aria-hidden="true">{{ text() }}</span>
    </div>
    <div
      class="ui-meter__bar"
      role="meter"
      [attr.aria-labelledby]="id"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuetext]="text()"
    >
      <span class="ui-meter__fill" [style.--ui-meter-value]="share()"></span>
    </div>
  `,
})
export class MeterComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly min = input(0);
  readonly max = input(100);
  /** The value in words, such as "7.2 of 10 GB". Defaults to a percentage. */
  readonly valueText = input<string>();
  readonly tone = input<MeterTone>('neutral');

  protected readonly id = `ui-meter-${nextId++}`;
  private readonly ratio = computed(() =>
    meterRatio(this.value(), this.min(), this.max()),
  );
  protected readonly share = computed(() => `${this.ratio() * 100}%`);
  protected readonly text = computed(
    () =>
      this.valueText() ??
      new Intl.NumberFormat(undefined, { style: 'percent' }).format(
        this.ratio(),
      ),
  );
  protected readonly classes = computed(() =>
    this.tone() === 'neutral'
      ? 'ui-meter'
      : `ui-meter ui-meter--${this.tone()}`,
  );
}

/** Where value sits between min and max, from 0 to 1, clamped. */
export function meterRatio(value: number, min: number, max: number): number {
  return Math.min(Math.max((value - min) / (max - min || 1), 0), 1);
}
