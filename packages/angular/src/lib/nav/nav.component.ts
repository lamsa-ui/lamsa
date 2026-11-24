import { Component, computed, inject, input } from '@angular/core';
import { UI_LABELS } from '../labels';

/**
 * Where the page sits: a navigation landmark around a list of links. Put each link in
 * an `<li>`; the last item is the page itself, with `aria-current="page"` and no link.
 * Works with `routerLink` or plain `href`.
 *
 * ```html
 * <ui-breadcrumbs label="Breadcrumb">
 *   <li><a routerLink="/orders">Orders</a></li>
 *   <li><span aria-current="page">Order 1042</span></li>
 * </ui-breadcrumbs>
 * ```
 */
@Component({
  selector: 'ui-breadcrumbs',
  host: {
    class: 'ui-breadcrumbs',
    role: 'navigation',
    '[attr.aria-label]': 'labelText()',
  },
  template: `<ol>
    <ng-content />
  </ol>`,
})
export class BreadcrumbsComponent {
  private readonly uiLabels = inject(UI_LABELS);
  /** Names the landmark; pass the translated text. */
  readonly label = input<string>();
  protected readonly labelText = computed(
    () => this.label() ?? this.uiLabels().breadcrumb,
  );
}

/**
 * The app's main links, in a side bar: a navigation landmark. Mark the current page's
 * link `aria-current="page"` (with the router: `routerLinkActive ariaCurrentWhenActive="page"`).
 * Group links under a `<h2 class="ui-nav__title ui-label">` when there are many.
 *
 * ```html
 * <ui-nav label="Main">
 *   <ul>
 *     <li><a routerLink="/orders" routerLinkActive ariaCurrentWhenActive="page">Orders</a></li>
 *   </ul>
 * </ui-nav>
 * ```
 */
@Component({
  selector: 'ui-nav',
  host: {
    class: 'ui-nav',
    role: 'navigation',
    '[attr.aria-label]': 'label()',
  },
  template: `<ng-content />`,
})
export class NavComponent {
  /** Names the landmark, so it differs from other navigation on the page. */
  readonly label = input.required<string>();
}
