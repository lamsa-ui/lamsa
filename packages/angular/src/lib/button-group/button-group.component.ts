import { Component, input } from '@angular/core';

/**
 * Buttons that belong together, joined into one bar and named as a group.
 *
 * ```html
 * <ui-button-group label="Text alignment">
 *   <button ui-button variant="secondary">Start</button>
 *   <button ui-button variant="secondary">Centre</button>
 * </ui-button-group>
 * ```
 */
@Component({
  selector: 'ui-button-group',
  host: {
    class: 'ui-button-group',
    role: 'group',
    '[attr.aria-label]': 'label()',
  },
  template: `<ng-content />`,
})
export class ButtonGroupComponent {
  /** What the buttons do together, for screen readers: "Text alignment". */
  readonly label = input.required<string>();
}
