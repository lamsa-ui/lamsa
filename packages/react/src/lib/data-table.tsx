'use client';

import { useId, type Key, type ReactNode } from 'react';
import { cx } from './class-names.js';
import { useOverflow } from './use-overflow.js';
import type { IconName } from '@lamsa-ui/icons';
import { Icon } from './icon.js';
import { useUiLabels } from './labels.js';

export interface TableColumn<T> {
  /** The row field this column shows, and the key in `sort`. */
  key: string;
  /** The translated header text. */
  header: string;
  sortable?: boolean;
  /** `end` for numbers and money: they line up on the last digit. */
  align?: 'start' | 'center' | 'end';
  /** A custom cell: badges, links, buttons. */
  cell?: (row: T) => ReactNode;
  /** The value to show, when it is not `row[key]` and there is no `cell`. */
  value?: (row: T) => ReactNode;
}

export interface TableSort {
  key: string;
  direction: 'ascending' | 'descending';
}

export interface DataTableProps<T> {
  /** Names the table. Shown above it unless `hideCaption`. */
  caption: string;
  /** Keep the caption for screen readers only, when a heading above already names the table. */
  hideCaption?: boolean;
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  /** A field (or function) that identifies a row; React uses it as the row key. */
  rowKey?: keyof T | ((row: T) => Key);
  /** The column and direction the rows are sorted by. Sort the rows yourself. */
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  loading?: boolean;
  /** Read to screen readers while loading; pass the translated text. */
  loadingLabel?: string;
  /** Shown when there are no rows; pass the translated text. */
  emptyMessage?: string;
}

function alignClass<T>(column: TableColumn<T>) {
  return column.align && column.align !== 'start'
    ? `ui-table__cell--${column.align}`
    : undefined;
}

/**
 * A data table: a real `<table>` named by its caption, sortable columns with the
 * sort state on the header for screen readers, custom cells, and empty and loading
 * states.
 *
 * ```tsx
 * <DataTable caption="Orders" columns={columns} rows={orders} sort={sort} onSortChange={setSort} />
 * ```
 */
/** Up when ascending, down when descending, both ways while the column is not sorted. */
const sortIcon = (sort: string | undefined): IconName =>
  sort === 'ascending'
    ? 'chevron-up'
    : sort === 'descending'
      ? 'chevron-down'
      : 'chevrons-up-down';

export function DataTable<T>({
  caption,
  hideCaption = false,
  columns,
  rows,
  rowKey,
  sort = null,
  onSortChange,
  loading = false,
  loadingLabel,
  emptyMessage,
}: DataTableProps<T>) {
  const t = useUiLabels();
  loadingLabel ??= t.loading;
  emptyMessage ??= t.noResults;
  const captionId = useId();
  // While the table scrolls sideways its wrapper takes focus, so the keyboard can scroll it.
  const [wrapRef, scrolls] = useOverflow<HTMLDivElement>('x');

  const ariaSort = (column: TableColumn<T>) =>
    column.sortable
      ? sort?.key === column.key
        ? sort.direction
        : 'none'
      : undefined;

  const toggleSort = (column: TableColumn<T>) =>
    onSortChange?.({
      key: column.key,
      direction:
        sort?.key === column.key && sort.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });

  const keyOf = (row: T, index: number): Key => {
    if (rowKey === undefined) return index;
    return typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] as Key);
  };

  const content = (row: T, column: TableColumn<T>): ReactNode => {
    if (column.cell) return column.cell(row);
    if (column.value) return column.value(row);
    return (row as Record<string, ReactNode>)[column.key];
  };

  return (
    <div
      ref={wrapRef}
      className="ui-table-wrap"
      tabIndex={scrolls ? 0 : undefined}
      role={scrolls ? 'region' : undefined}
      aria-labelledby={scrolls ? captionId : undefined}
      aria-busy={loading || undefined}
    >
      <table className="ui-table">
        <caption
          id={captionId}
          className={cx(
            'ui-table__caption',
            hideCaption && 'ui-visually-hidden',
          )}
        >
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={alignClass(column)}
                aria-sort={ariaSort(column)}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className="ui-table__sort"
                    data-testid={`ui-sort-${column.key}`}
                    onClick={() => toggleSort(column)}
                  >
                    {column.header}
                    <Icon
                      className="ui-table__sort-icon"
                      name={sortIcon(ariaSort(column))}
                    />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={keyOf(row, index)}>
                {columns.map((column) => (
                  <td key={column.key} className={alignClass(column)}>
                    {content(row, column)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="ui-table__empty" colSpan={columns.length}>
                {loading ? '' : emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {loading && (
        <div className="ui-table__loading" aria-hidden="true">
          <span className="ui-spinner" />
        </div>
      )}
      <span className="ui-visually-hidden" role="status">
        {loading ? loadingLabel : ''}
      </span>
    </div>
  );
}
