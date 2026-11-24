import { Component, computed, inject, input, model } from '@angular/core';
import { UI_LABELS } from '../labels';
import { pageSlots } from './page-slots';
import { IconComponent } from '../icon/icon.component';
import {
  MenuComponent,
  MenuItemComponent,
  MenuTriggerDirective,
} from '../menu/menu';

export interface PaginationLabels {
  /** The name of the navigation landmark. */
  nav: string;
  previous: string;
  next: string;
  /** The name of a page button. */
  page: (page: number) => string;
  /** The line that says which rows are shown. */
  summary: (first: number, last: number, total: number) => string;
  /** The label of the rows-per-page picker. */
  pageSize: string;
}

/**
 * Page navigation, 1-based. Bind `[(page)]` (and `[(pageSize)]` with `pageSizes`).
 * Previous and next stay focusable at the ends, marked unavailable instead of
 * disabled, so focus never jumps away. Pass translated `labels`.
 *
 * ```html
 * <ui-pagination [(page)]="page" [total]="total()" [pageSize]="20" />
 * ```
 */
@Component({
  imports: [
    IconComponent,
    MenuTriggerDirective,
    MenuComponent,
    MenuItemComponent,
  ],
  selector: 'ui-pagination',
  template: `
    <nav class="ui-pagination" [attr.aria-label]="text().nav">
      <p class="ui-pagination__summary" role="status">{{ summary() }}</p>
      @if (pageSizes().length) {
        <div class="ui-pagination__size">
          <span>{{ text().pageSize }}</span>
          <button
            #sizeTrigger
            type="button"
            class="ui-button ui-button--secondary ui-button--md"
            [attr.aria-label]="text().pageSize + ': ' + pageSize()"
            [uiMenuTrigger]="sizes"
            data-testid="ui-pagination-size"
          >
            {{ pageSize() }}
            <ui-icon name="chevron-down" class="ui-select__chevron" />
          </button>
          <ng-template #sizes>
            <ui-menu
              class="ui-menu--trigger-width"
              [style.inline-size.px]="sizeTrigger.offsetWidth"
            >
              @for (size of pageSizes(); track size) {
                <button ui-menu-item (triggered)="changeSize(size)">
                  {{ size }}
                </button>
              }
            </ui-menu>
          </ng-template>
        </div>
      }
      <ul class="ui-pagination__list">
        <li>
          <button
            type="button"
            class="ui-button ui-button--ghost ui-button--sm ui-pagination__step"
            data-testid="ui-pagination-previous"
            [attr.aria-label]="text().previous"
            [attr.aria-disabled]="page() <= 1 || null"
            (click)="go(page() - 1)"
          >
            <ui-icon name="chevron-left" class="ui-pagination__arrow" />
          </button>
        </li>
        @for (slot of slots(); track $index) {
          <li>
            @if (slot === 0) {
              <span class="ui-pagination__gap" aria-hidden="true">…</span>
            } @else {
              <button
                type="button"
                class="ui-button ui-button--ghost ui-button--sm ui-pagination__page"
                [attr.aria-label]="text().page(slot)"
                [attr.aria-current]="slot === page() ? 'page' : null"
                (click)="go(slot)"
              >
                {{ slot }}
              </button>
            }
          </li>
        }
        <li>
          <button
            type="button"
            class="ui-button ui-button--ghost ui-button--sm ui-pagination__step"
            data-testid="ui-pagination-next"
            [attr.aria-label]="text().next"
            [attr.aria-disabled]="page() >= pageCount() || null"
            (click)="go(page() + 1)"
          >
            <ui-icon name="chevron-right" class="ui-pagination__arrow" />
          </button>
        </li>
      </ul>
    </nav>
  `,
})
export class PaginationComponent {
  /** The current page, starting at 1. */
  readonly page = model.required<number>();
  readonly pageSize = model(10);
  /** The number of rows across all pages. */
  readonly total = input.required<number>();
  /** Offer these page sizes in a picker. Empty: no picker. */
  readonly pageSizes = input<readonly number[]>([]);
  /** Translated texts; any you leave out come from provideUiLabels (English by default). */
  readonly labels = input<Partial<PaginationLabels>>({});

  private readonly uiLabels = inject(UI_LABELS);
  protected readonly text = computed(() => ({
    ...this.uiLabels().pagination,
    ...this.labels(),
  }));
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize())),
  );
  protected readonly slots = computed(() =>
    pageSlots(this.page(), this.pageCount()),
  );
  protected readonly summary = computed(() => {
    const first = Math.min(
      this.total(),
      (this.page() - 1) * this.pageSize() + 1,
    );
    const last = Math.min(this.total(), this.page() * this.pageSize());
    return this.text().summary(first, last, this.total());
  });

  protected go(page: number): void {
    if (page >= 1 && page <= this.pageCount() && page !== this.page()) {
      this.page.set(page);
    }
  }

  protected changeSize(size: number): void {
    if (size !== this.pageSize()) {
      this.pageSize.set(size);
      this.page.set(1);
    }
  }
}
