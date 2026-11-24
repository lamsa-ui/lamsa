import { Component, input } from '@angular/core';

let nextId = 0;

/**
 * A titled group of fields inside a longer form, such as an address. Screen readers
 * read the legend before each field in it.
 *
 * ```html
 * <fieldset ui-fieldset legend="Delivery address">
 *   <ui-text-field label="Street" formControlName="street" />
 * </fieldset>
 * ```
 */
@Component({
  selector: 'fieldset[ui-fieldset]',
  host: {
    class: 'ui-fieldset',
    '[attr.aria-describedby]': "hint() ? id + '-hint' : null",
  },
  template: `
    <legend class="ui-fieldset__legend">{{ legend() }}</legend>
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
    <ng-content />
  `,
})
export class FieldsetComponent {
  readonly legend = input.required<string>();
  readonly hint = input<string>();

  protected readonly id = `ui-fieldset-${nextId++}`;
}
