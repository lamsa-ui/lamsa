import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  DataTableComponent,
  TableCellDirective,
  type TableColumn,
  type TableSort,
} from './data-table.component';

interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
}

@Component({
  imports: [DataTableComponent, TableCellDirective],
  template: `
    <ui-data-table
      caption="Orders"
      [columns]="columns"
      [rows]="rows()"
      [(sort)]="sort"
      [loading]="loading()"
      rowKey="id"
      emptyMessage="No orders yet"
    >
      <ng-template uiCell="status" let-order>
        <strong data-testid="status">{{ order.status }}</strong>
      </ng-template>
    </ui-data-table>
  `,
})
class HostComponent {
  readonly columns: TableColumn<Order>[] = [
    { key: 'customer', header: 'Customer', sortable: true },
    {
      key: 'total',
      header: 'Total',
      align: 'end',
      value: (o) => `${o.total} EGP`,
    },
    { key: 'status', header: 'Status' },
  ];
  readonly rows = signal<Order[]>([
    { id: 1, customer: 'Mona', total: 340, status: 'Paid' },
    { id: 2, customer: 'Karim', total: 120, status: 'Late' },
  ]);
  readonly sort = signal<TableSort | null>(null);
  readonly loading = signal(false);
}

describe('DataTableComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, root };
  }

  it('is a table named by its caption, with column headers', async () => {
    const { root } = await setup();
    expect(root.querySelector('caption')?.textContent?.trim()).toBe('Orders');
    const headers = [...root.querySelectorAll('th')];
    expect(headers.map((th) => th.textContent?.trim())).toEqual([
      'Customer',
      'Total',
      'Status',
    ]);
    expect(headers.every((th) => th.getAttribute('scope') === 'col')).toBe(
      true,
    );
  });

  it('renders values, custom cells and end-aligned numbers', async () => {
    const { root } = await setup();
    const cells = [
      ...root.querySelectorAll('tbody tr')[0].querySelectorAll('td'),
    ];
    expect(cells[0].textContent?.trim()).toBe('Mona');
    expect(cells[1].textContent?.trim()).toBe('340 EGP');
    expect(cells[1].className).toBe('ui-table__cell--end');
    expect(cells[2].querySelector('[data-testid="status"]')?.textContent).toBe(
      'Paid',
    );
  });

  it('cycles the sort and puts its state on the header', async () => {
    const { fixture, root } = await setup();
    const header = root.querySelector('th')!;
    const button = root.querySelector<HTMLButtonElement>(
      '[data-testid="ui-sort-customer"]',
    )!;
    expect(header.getAttribute('aria-sort')).toBe('none');
    expect(root.querySelectorAll('th')[1].getAttribute('aria-sort')).toBeNull();

    button.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.sort()).toEqual({
      key: 'customer',
      direction: 'ascending',
    });
    expect(header.getAttribute('aria-sort')).toBe('ascending');

    button.click();
    await fixture.whenStable();
    expect(header.getAttribute('aria-sort')).toBe('descending');
  });

  it('shows the empty message, and announces loading', async () => {
    const { fixture, root } = await setup();
    fixture.componentInstance.rows.set([]);
    await fixture.whenStable();
    expect(root.querySelector('.ui-table__empty')?.textContent?.trim()).toBe(
      'No orders yet',
    );
    expect(
      root.querySelector('.ui-table__empty')?.getAttribute('colspan'),
    ).toBe('3');

    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();
    expect(
      root.querySelector('.ui-table-wrap')?.getAttribute('aria-busy'),
    ).toBe('true');
    expect(root.querySelector('[role="status"]')?.textContent?.trim()).toBe(
      'Loading',
    );
  });
});
