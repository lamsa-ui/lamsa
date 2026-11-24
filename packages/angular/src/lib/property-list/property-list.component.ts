import { Component, computed, input } from '@angular/core';

/**
 * Label and value pairs on a native `<dl>`, such as order details. Two columns when
 * there is room; label above value when the list is narrow or `layout="stacked"`.
 *
 * ```html
 * <dl ui-property-list>
 *   <div ui-property term="Order">#1042</div>
 *   <div ui-property term="Status"><ui-badge variant="success">Paid</ui-badge></div>
 * </dl>
 * ```
 */
@Component({
  selector: 'dl[ui-property-list]',
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class PropertyListComponent {
  readonly layout = input<'columns' | 'stacked'>('columns');

  protected readonly classes = computed(() =>
    this.layout() === 'stacked'
      ? 'ui-property-list ui-property-list--stacked'
      : 'ui-property-list',
  );
}

/** One pair in a property list: the term, and the value as content. */
@Component({
  selector: 'div[ui-property]',
  host: { class: 'ui-property-list__item' },
  template: `<dt>{{ term() }}</dt>
    <dd><ng-content /></dd>`,
})
export class PropertyComponent {
  readonly term = input.required<string>();
}
