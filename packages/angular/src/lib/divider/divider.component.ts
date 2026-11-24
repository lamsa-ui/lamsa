import { Component, computed, input } from '@angular/core';

/**
 * A thin rule between groups of content. With a `label` ("or") the words sit in the middle
 * and are read as text; without one it is a separator.
 *
 * ```html
 * <ui-divider />
 * <ui-divider label="or" />
 * <ui-divider orientation="vertical" />
 * ```
 */
@Component({
  selector: 'ui-divider',
  host: {
    '[class]': 'classes()',
    '[attr.role]': 'label() ? null : "separator"',
    '[attr.aria-orientation]':
      'label() || orientation() === "horizontal" ? null : "vertical"',
  },
  template: `{{ label() }}`,
})
export class DividerComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** Words in the middle of the line. Horizontal only. */
  readonly label = input<string>();

  protected readonly classes = computed(() =>
    this.label()
      ? 'ui-divider ui-divider--label'
      : this.orientation() === 'vertical'
        ? 'ui-divider ui-divider--vertical'
        : 'ui-divider',
  );
}
