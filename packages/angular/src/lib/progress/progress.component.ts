import { Component, computed, input } from '@angular/core';

let nextId = 0;

/**
 * A progress bar named by its label, on the native `<progress>`, with the amount in
 * words beside it. Leave `value` out while the length of the work is unknown.
 *
 * ```html
 * <ui-progress label="Uploading invoice.pdf" [value]="sent()" />
 * ```
 */
@Component({
  selector: 'ui-progress',
  host: { class: 'ui-progress' },
  template: `
    <div class="ui-progress__head">
      <span class="ui-progress__label" [id]="id">{{ label() }}</span>
      @if (text(); as text) {
        <span class="ui-progress__value" aria-hidden="true">{{ text }}</span>
      }
    </div>
    <progress
      class="ui-progress__bar"
      [attr.aria-labelledby]="id"
      [attr.value]="value() ?? null"
      [max]="max()"
      [attr.aria-valuetext]="valueText() ?? null"
      [attr.data-testid]="testId()"
    ></progress>
  `,
})
export class ProgressComponent {
  readonly label = input.required<string>();
  /** How much is done, from 0 to `max`. Leave it out when the end is not known. */
  readonly value = input<number | null>();
  readonly max = input(100);
  /** The amount in words, such as "3 of 5 files". Defaults to a percentage. */
  readonly valueText = input<string>();
  readonly testId = input<string>();

  protected readonly id = `ui-progress-${nextId++}`;
  protected readonly text = computed(() => {
    const value = this.value();
    if (this.valueText()) return this.valueText();
    if (value == null) return '';
    return new Intl.NumberFormat(undefined, { style: 'percent' }).format(
      Math.min(Math.max(value / this.max(), 0), 1),
    );
  });
}
