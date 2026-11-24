'use client';

import { pageSlots } from './page-slots.js';
import { Icon } from './icon.js';
import { Menu } from './menu.js';
import { useUiLabels } from './labels.js';

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

export interface PaginationProps {
  /** The current page, starting at 1. */
  page: number;
  onPageChange: (page: number) => void;
  /** The number of rows across all pages. */
  total: number;
  pageSize?: number;
  /** Called with the new size; the page goes back to 1 through `onPageChange`. */
  onPageSizeChange?: (pageSize: number) => void;
  /** Offer these page sizes in a picker. Empty: no picker. */
  pageSizes?: readonly number[];
  /** Translated texts; any you leave out stay English. */
  labels?: Partial<PaginationLabels>;
}

/**
 * Page navigation, 1-based. Previous and next stay focusable at the ends, marked
 * unavailable instead of disabled, so focus never jumps away. Pass translated `labels`.
 *
 * ```tsx
 * <Pagination page={page} onPageChange={setPage} total={total} pageSize={20} />
 * ```
 */
export function Pagination({
  page,
  onPageChange,
  total,
  pageSize = 10,
  onPageSizeChange,
  pageSizes = [],
  labels,
}: PaginationProps) {
  const text = { ...useUiLabels().pagination, ...labels };
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = Math.min(total, (page - 1) * pageSize + 1);
  const last = Math.min(total, page * pageSize);

  const go = (target: number) => {
    if (target >= 1 && target <= pageCount && target !== page)
      onPageChange(target);
  };

  return (
    <nav className="ui-pagination" aria-label={text.nav}>
      <p className="ui-pagination__summary" role="status">
        {text.summary(first, last, total)}
      </p>
      {pageSizes.length > 0 && (
        <div className="ui-pagination__size">
          <span>{text.pageSize}</span>
          <Menu
            label={
              <>
                {pageSize}
                <Icon name="chevron-down" className="ui-select__chevron" />
              </>
            }
            aria-label={`${text.pageSize}: ${pageSize}`}
            matchTriggerWidth
            testId="ui-pagination-size"
            items={pageSizes.map((size) => ({
              id: String(size),
              label: String(size),
            }))}
            onAction={(size) => {
              const nextSize = Number(size);
              if (nextSize !== pageSize) {
                onPageSizeChange?.(nextSize);
                onPageChange(1);
              }
            }}
          />
        </div>
      )}
      <ul className="ui-pagination__list">
        <li>
          <button
            type="button"
            className="ui-button ui-button--ghost ui-button--sm ui-pagination__step"
            data-testid="ui-pagination-previous"
            aria-label={text.previous}
            aria-disabled={page <= 1 || undefined}
            onClick={() => go(page - 1)}
          >
            <Icon name="chevron-left" className="ui-pagination__arrow" />
          </button>
        </li>
        {pageSlots(page, pageCount).map((slot, index) => (
          <li key={slot === 0 ? `gap-${index}` : slot}>
            {slot === 0 ? (
              <span className="ui-pagination__gap" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                type="button"
                className="ui-button ui-button--ghost ui-button--sm ui-pagination__page"
                aria-label={text.page(slot)}
                aria-current={slot === page ? 'page' : undefined}
                onClick={() => go(slot)}
              >
                {slot}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            className="ui-button ui-button--ghost ui-button--sm ui-pagination__step"
            data-testid="ui-pagination-next"
            aria-label={text.next}
            aria-disabled={page >= pageCount || undefined}
            onClick={() => go(page + 1)}
          >
            <Icon name="chevron-right" className="ui-pagination__arrow" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
