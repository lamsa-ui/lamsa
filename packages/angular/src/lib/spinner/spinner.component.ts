import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { UI_LABELS } from '../labels';

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
    <span [class.ui-visually-hidden]="!showLabel()">{{ labelText() }}</span>
  `,
})
export class SpinnerComponent {
  private readonly uiLabels = inject(UI_LABELS);
  /** What is loading, in words; read by screen readers. Pass the translated text. */
  readonly label = input<string>();
  protected readonly labelText = computed(
    () => this.label() ?? this.uiLabels().loading,
  );
  /** Shows the label next to the spinner too. */
  readonly showLabel = input(false, { transform: booleanAttribute });
  /** `lg`: a bigger spinner over its label, for a whole page or panel. */
  readonly size = input<'md' | 'lg'>('md');
}
