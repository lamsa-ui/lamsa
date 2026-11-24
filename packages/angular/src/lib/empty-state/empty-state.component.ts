import { Component, input } from '@angular/core';

/**
 * Shown where a list or table has nothing yet: what belongs here, why it is empty,
 * and the one action that fills it. Put buttons in `ui-empty-state-actions`.
 *
 * ```html
 * <ui-empty-state title="No orders yet" [level]="2">
 *   <p>Orders show here once a customer pays.</p>
 *   <div ui-empty-state-actions><button ui-button>Share your menu</button></div>
 * </ui-empty-state>
 * ```
 */
@Component({
  selector: 'ui-empty-state',
  host: { class: 'ui-empty-state' },
  template: `
    @switch (level()) {
      @case (2) {
        <h2 class="ui-empty-state__title">{{ title() }}</h2>
      }
      @case (4) {
        <h4 class="ui-empty-state__title">{{ title() }}</h4>
      }
      @default {
        <h3 class="ui-empty-state__title">{{ title() }}</h3>
      }
    }
    <ng-content />
    <div class="ui-empty-state__actions">
      <ng-content select="[ui-empty-state-actions]" />
    </div>
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  /** Heading level of the title, so it fits the page's heading outline. */
  readonly level = input<2 | 3 | 4>(3);
}
