import {
  booleanAttribute,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import type { ButtonSize } from '../button/button.component';

/**
 * A button that stays pressed until pressed again, such as "Pin" or a view switch.
 * Screen readers hear "pressed" or "not pressed". Keep the label the same in both states.
 *
 * ```html
 * <button ui-toggle [(pressed)]="pinned">Pin</button>
 * ```
 */
@Component({
  selector: 'button[ui-toggle]',
  template: `<ng-content />`,
  host: {
    type: 'button',
    '[class]': 'classes()',
    '[attr.aria-pressed]': 'pressed()',
    '[disabled]': 'disabled()',
    '(click)': 'pressed.set(!pressed())',
  },
})
export class ToggleComponent {
  readonly pressed = model(false);
  readonly size = input<ButtonSize>('md');
  /** A square toggle whose only content is an icon. Give it an `aria-label`. */
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(
    () =>
      `ui-button ui-button--secondary ui-button--${this.size()} ui-toggle` +
      (this.iconOnly() ? ' ui-button--icon' : ''),
  );
}
