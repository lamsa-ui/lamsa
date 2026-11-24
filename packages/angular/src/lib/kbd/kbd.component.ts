import { Component } from '@angular/core';

/**
 * A key on the keyboard, on the native `<kbd>`. For a shortcut, one per key:
 *
 * ```html
 * <kbd ui-kbd>Ctrl</kbd> + <kbd ui-kbd>K</kbd>
 * ```
 */
@Component({
  selector: 'kbd[ui-kbd]',
  host: { class: 'ui-kbd' },
  template: `<ng-content />`,
})
export class KbdComponent {}
