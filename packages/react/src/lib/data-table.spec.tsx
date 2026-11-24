import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { DataTable, type TableColumn, type TableSort } from './data-table.js';
import { pageSlots } from './page-slots.js';
import { Pagination } from './pagination.js';

interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
}

const orders: Order[] = [
  { id: 1, customer: 'Mona', total: 340, status: 'Paid' },
  { id: 2, customer: 'Karim', total: 120, status: 'Late' },
];

const columns: TableColumn<Order>[] = [
  { key: 'customer', header: 'Customer', sortable: true },
  {
    key: 'total',
    header: 'Total',
    align: 'end',
    value: (o) => `${o.total} EGP`,
  },
  { key: 'status', header: 'Status', cell: (o) => <strong>{o.status}</strong> },
];

function Table(props: { rows?: Order[]; loading?: boolean }) {
  const [sort, setSort] = useState<TableSort | null>(null);
  return (
    <DataTable
      caption="Orders"
      columns={columns}
      rows={props.rows ?? orders}
      rowKey="id"
      sort={sort}
      onSortChange={setSort}
      loading={props.loading}
      emptyMessage="No orders yet"
    />
  );
}

describe('DataTable', () => {
  it('is a table named by its caption, with column headers', () => {
    render(<Table />);
    const table = screen.getByRole('table', { name: 'Orders' });
    const headers = screen.getAllByRole('columnheader');
    expect(table).not.toBeNull();
    expect(headers.map((th) => th.textContent)).toEqual([
      'Customer',
      'Total',
      'Status',
    ]);
  });

  it('renders values, custom cells and end-aligned numbers', () => {
    render(<Table />);
    const cells = screen.getAllByRole('row')[1].querySelectorAll('td');
    expect(cells[1].textContent).toBe('340 EGP');
    expect(cells[1].className).toBe('ui-table__cell--end');
    expect(cells[2].querySelector('strong')?.textContent).toBe('Paid');
  });

  it('cycles the sort and puts its state on the header', async () => {
    render(<Table />);
    const header = screen.getAllByRole('columnheader')[0];
    expect(header.getAttribute('aria-sort')).toBe('none');
    expect(
      screen.getAllByRole('columnheader')[1].getAttribute('aria-sort'),
    ).toBeNull();

    await userEvent.click(screen.getByTestId('ui-sort-customer'));
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    await userEvent.click(screen.getByTestId('ui-sort-customer'));
    expect(header.getAttribute('aria-sort')).toBe('descending');
  });

  it('shows the empty message, and announces loading', () => {
    const { rerender } = render(<Table rows={[]} />);
    expect(screen.getByText('No orders yet').getAttribute('colspan')).toBe('3');

    rerender(<Table rows={[]} loading />);
    expect(screen.getByRole('status').textContent).toBe('Loading');
    expect(
      document.querySelector('.ui-table-wrap')?.getAttribute('aria-busy'),
    ).toBe('true');
  });
});

describe('pageSlots', () => {
  it('keeps the ends and the neighbours, with gaps between', () => {
    expect(pageSlots(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(pageSlots(5, 10)).toEqual([1, 0, 4, 5, 6, 0, 10]);
    expect(pageSlots(4, 10)).toEqual([1, 2, 3, 4, 5, 0, 10]);
  });
});

describe('Pagination', () => {
  function Host() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return (
      <Pagination
        page={page}
        onPageChange={setPage}
        total={42}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizes={[10, 20]}
        labels={{ page: (n) => `صفحة ${n}` }}
      />
    );
  }

  it('is a named navigation with the current page marked and a summary', () => {
    render(<Host />);
    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).not.toBeNull();
    expect(
      screen
        .getByRole('button', { name: 'صفحة 1' })
        .getAttribute('aria-current'),
    ).toBe('page');
    expect(screen.getByRole('status').textContent).toBe('1–10 of 42');
  });

  it('keeps previous focusable but unavailable on page 1, and moves on', async () => {
    render(<Host />);
    const previous = screen.getByTestId('ui-pagination-previous');
    expect(previous).toHaveProperty('disabled', false);
    expect(previous.getAttribute('aria-disabled')).toBe('true');

    await userEvent.click(screen.getByTestId('ui-pagination-next'));
    expect(screen.getByRole('status').textContent).toBe('11–20 of 42');
    expect(previous.getAttribute('aria-disabled')).toBeNull();
  });

  it('changes the page size and goes back to page 1', async () => {
    render(<Host />);
    await userEvent.click(screen.getByRole('button', { name: 'صفحة 3' }));
    const sizeMenu = screen.getByTestId('ui-pagination-size');
    expect(sizeMenu.tagName).toBe('BUTTON');
    await userEvent.click(sizeMenu);
    expect(
      screen.getByRole('menu').classList.contains('ui-menu--trigger-width'),
    ).toBe(true);
    await userEvent.click(screen.getByRole('menuitem', { name: '10' }));
    expect(screen.getByRole('status').textContent).toBe('21–30 of 42');
    await userEvent.click(sizeMenu);
    await userEvent.click(screen.getByRole('menuitem', { name: '20' }));
    expect(screen.getByRole('status').textContent).toBe('1–20 of 42');
    expect(
      screen
        .getByRole('button', { name: 'صفحة 1' })
        .getAttribute('aria-current'),
    ).toBe('page');
  });
});
