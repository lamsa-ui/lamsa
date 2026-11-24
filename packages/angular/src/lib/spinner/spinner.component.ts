import { booleanAttribute, Component, input } from '@angular/core';

/**
 * Shows that something is loading, and says so to screen readers. Keep it for waits
 * of more than a second; for a busy button, use `[loading]` on the button instead.
 *
 * ```html
 * <ui-spinner label="Loading orders" />
 * ```
 */
@Component({
  selector: 'ui-spinner',
  host: {
    role: 'status',
    '[class.ui-loading]': 'true',
    '[class.ui-loading--lg]': "size() === 'lg'",
  },
  template: `
    <span class="ui-spinner" aria-hidden="true"></span>
    <span [class.ui-visually-hidden]="!showLabel()">{{ label() }}</span>
  `,
})
export class SpinnerComponent {
  /** What is loading, in words; read by screen readers. Pass the translated text. */
  readonly label = input('Loading');
  /** Shows the label next to the spinner too. */
  readonly showLabel = input(false, { transform: booleanAttribute });
  /** `lg`: a bigger spinner over its label, for a whole page or panel. */
  readonly size = input<'md' | 'lg'>('md');
}
