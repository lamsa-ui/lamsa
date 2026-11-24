import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  DataTableComponent,
  PaginationComponent,
  TableCellDirective,
  type BadgeVariant,
  type TableColumn,
  type TableSort,
} from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

interface Order {
  id: number;
  customer: string;
  placed: string;
  total: number;
  status: 'Paid' | 'Preparing' | 'Late' | 'Cancelled';
}

const names = [
  'Hatem Mohamed',
  'Mohamed Ibrahim',
  'Ibrahim Hatem',
  'Hatem Ibrahim',
  'Mohamed Hatem',
  'Ibrahim Mohamed',
  'Hatem Mohamed',
  'Mohamed Ibrahim',
];
const statuses: Order['status'][] = [
  'Paid',
  'Preparing',
  'Paid',
  'Late',
  'Paid',
  'Cancelled',
];
const orders: Order[] = Array.from({ length: 23 }, (_, i) => ({
  id: 1040 + i,
  customer: names[i % names.length],
  placed: `2026-11-${String(18 - (i % 9)).padStart(2, '0')}`,
  total: 85 + ((i * 137) % 900),
  status: statuses[i % statuses.length],
}));

const tones: Record<Order['status'], BadgeVariant> = {
  Paid: 'success',
  Preparing: 'info',
  Late: 'warning',
  Cancelled: 'danger',
};

@Component({
  selector: 'app-data-table-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    DataTableComponent,
    TableCellDirective,
    PaginationComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    RouterLink,
  ],
  template: `
    <app-page
      title="Data table"
      lead="Rows of records the reader scans and compares: orders, users, payments. A real table, named by its caption, so screen readers announce the row and column of every cell. Sorting is announced too."
      [usage]="usage"
    >
      <app-example
        title="Sorting, custom cells and pagination"
        description="Sort by customer, date or total. Status is a badge; totals line up on the last digit. The table only reports the sort: the page sorts and slices the rows, usually on the server."
        [code]="orders"
      >
        <ui-card class="doc-wide">
          <ui-data-table
            caption="Orders"
            [columns]="columns"
            [rows]="pageRows()"
            [(sort)]="sort"
            rowKey="id"
          >
            <ng-template uiCell="status" let-order>
              <ui-badge [variant]="tone(order)">{{ order.status }}</ui-badge>
            </ng-template>
          </ui-data-table>
          <ui-pagination [(page)]="page" [total]="all.length" [pageSize]="8" />
        </ui-card>
      </app-example>

      <app-example
        title="Empty and loading"
        description="Say why the table is empty in words. While loading, the table is marked busy and screen readers hear the loading text once."
        [code]="states"
      >
        <div class="doc-stack doc-wide">
          <div class="doc-row">
            <button
              ui-button
              variant="secondary"
              type="button"
              (click)="loading.set(!loading())"
            >
              {{ loading() ? 'Stop loading' : 'Start loading' }}
            </button>
          </div>
          <ui-data-table
            caption="Orders today"
            [columns]="columns"
            [rows]="[]"
            [loading]="loading()"
            emptyMessage="No orders today yet."
          />
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-card class="doc-wide">
          <ui-data-table
            caption="الطلبات"
            [columns]="columnsAr"
            [rows]="ordersAr"
            rowKey="id"
          />
          <ui-pagination
            [page]="1"
            [total]="23"
            [pageSize]="8"
            [labels]="labelsAr"
          />
        </ui-card>
      </app-example>

      <p class="doc-note">
        Page navigation has its own page:
        <a routerLink="/components/pagination">Pagination</a>.
      </p>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class DataTablePageComponent {
  protected readonly all = orders;
  protected readonly columns: TableColumn<Order>[] = [
    { key: 'id', header: 'Order', value: (o) => `#${o.id}` },
    { key: 'customer', header: 'Customer', sortable: true },
    { key: 'placed', header: 'Placed', sortable: true },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      align: 'end',
      value: (o) => `${o.total} EGP`,
    },
    { key: 'status', header: 'Status' },
  ];
  protected readonly sort = signal<TableSort | null>({
    key: 'placed',
    direction: 'descending',
  });
  protected readonly page = signal(1);
  protected readonly loading = signal(true);

  private readonly sorted = computed(() => {
    const sort = this.sort();
    if (!sort) return orders;
    const key = sort.key as keyof Order;
    const factor = sort.direction === 'ascending' ? 1 : -1;
    return [...orders].sort(
      (a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * factor,
    );
  });
  protected readonly pageRows = computed(() =>
    this.sorted().slice((this.page() - 1) * 8, this.page() * 8),
  );

  protected tone(order: Order): BadgeVariant {
    return tones[order.status];
  }

  protected readonly columnsAr: TableColumn<{
    id: number;
    customer: string;
    total: string;
  }>[] = [
    { key: 'id', header: 'الطلب', value: (o) => `#${o.id}` },
    { key: 'customer', header: 'العميل' },
    { key: 'total', header: 'الإجمالي', align: 'end' },
  ];
  protected readonly ordersAr = [
    { id: 1042, customer: 'حاتم محمد', total: '٣٤٠ جنيه' },
    { id: 1041, customer: 'محمد إبراهيم', total: '١٢٠ جنيه' },
    { id: 1040, customer: 'إبراهيم حاتم', total: '٨٥ جنيه' },
  ];
  protected readonly labelsAr = {
    nav: 'التنقل بين الصفحات',
    previous: 'الصفحة السابقة',
    next: 'الصفحة التالية',
    page: (n: number) => `صفحة ${n}`,
    summary: (first: number, last: number, total: number) =>
      `${first}–${last} من ${total}`,
  };

  protected readonly usage = {
    angular: `import {
  DataTableComponent,
  TableCellDirective,
  type TableColumn,
  type TableSort,
} from '@lamsa-ui/angular';`,
    react: `import { DataTable, type TableColumn, type TableSort } from '@lamsa-ui/react';`,
    vue: `import { DataTable, type TableColumn, type TableSort } from '@lamsa-ui/vue';`,
    html: `<div class="ui-table-wrap">
  <table class="ui-table">
    <caption class="ui-table__caption">Orders</caption>
    ...
  </table>
</div>`,
  };

  protected readonly orders = {
    angular: `columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order', value: (o) => '#' + o.id },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'placed', header: 'Placed', sortable: true },
  { key: 'total', header: 'Total', sortable: true, align: 'end', value: (o) => o.total + ' EGP' },
  { key: 'status', header: 'Status' },
];
sort = signal<TableSort | null>({ key: 'placed', direction: 'descending' });
page = signal(1);
// Load or sort the rows for sort() and page(), usually on the server.

<ui-card>
  <ui-data-table caption="Orders" [columns]="columns" [rows]="rows()" [(sort)]="sort" rowKey="id">
    <ng-template uiCell="status" let-order>
      <ui-badge [variant]="tone(order)">{{ order.status }}</ui-badge>
    </ng-template>
  </ui-data-table>
  <ui-pagination [(page)]="page" [total]="total()" [pageSize]="8" />
</ui-card>`,
    react: `const columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order', value: (o) => '#' + o.id },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'placed', header: 'Placed', sortable: true },
  { key: 'total', header: 'Total', sortable: true, align: 'end', value: (o) => o.total + ' EGP' },
  { key: 'status', header: 'Status', cell: (o) => <Badge variant={tone(o)}>{o.status}</Badge> },
];
const [sort, setSort] = useState<TableSort | null>({ key: 'placed', direction: 'descending' });
const [page, setPage] = useState(1);
// Load or sort the rows for sort and page, usually on the server.

<Card>
  <DataTable caption="Orders" columns={columns} rows={rows} rowKey="id" sort={sort} onSortChange={setSort} />
  <Pagination page={page} onPageChange={setPage} total={total} pageSize={8} />
</Card>`,
    vue: `<script setup lang="ts">
import { Badge, Card, DataTable, Pagination, type TableColumn, type TableSort } from '@lamsa-ui/vue';
import { ref } from 'vue';

const columns: TableColumn<Order>[] = [
  { key: 'id', header: 'Order', value: (o) => '#' + o.id },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'placed', header: 'Placed', sortable: true },
  { key: 'total', header: 'Total', sortable: true, align: 'end', value: (o) => o.total + ' EGP' },
  { key: 'status', header: 'Status' },
];
const sort = ref<TableSort | null>({ key: 'placed', direction: 'descending' });
const page = ref(1);
// Load or sort the rows for sort and page, usually on the server.
</script>

<template>
  <Card>
    <DataTable v-model:sort="sort" caption="Orders" :columns="columns" :rows="rows" rowKey="id">
      <template #cell-status="{ row }"><Badge :variant="tone(row)">{{ row.status }}</Badge></template>
    </DataTable>
    <Pagination v-model:page="page" :total="total" :page-size="8" />
  </Card>
</template>`,
    html: `<div class="ui-table-wrap">
  <table class="ui-table">
    <caption class="ui-table__caption">Orders</caption>
    <thead>
      <tr>
        <th scope="col">Order</th>
        <th scope="col" aria-sort="none">
          <button type="button" class="ui-table__sort">Customer <i class="ui-icon ui-icon-chevrons-up-down ui-table__sort-icon" aria-hidden="true"></i></button>
        </th>
        <th scope="col" aria-sort="descending">
          <button type="button" class="ui-table__sort">Placed <i class="ui-icon ui-icon-chevron-down ui-table__sort-icon" aria-hidden="true"></i></button>
        </th>
        <th scope="col" class="ui-table__cell--end">Total</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>#1040</td>
        <td>Hatem Mohamed</td>
        <td>2026-11-18</td>
        <td class="ui-table__cell--end">85 EGP</td>
        <td><span class="ui-badge ui-badge--success">Paid</span></td>
      </tr>
    </tbody>
  </table>
</div>
<!-- Sorting needs a small script: sort the rows on click and update aria-sort on the th. -->`,
  };

  protected readonly states = {
    angular: `<ui-data-table
  caption="Orders today"
  [columns]="columns"
  [rows]="rows()"
  [loading]="loading()"
  loadingLabel="Loading orders"
  emptyMessage="No orders today yet."
/>`,
    react: `<DataTable
  caption="Orders today"
  columns={columns}
  rows={rows}
  loading={loading}
  loadingLabel="Loading orders"
  emptyMessage="No orders today yet."
/>`,
    vue: `<DataTable
  caption="Orders today"
  :columns="columns"
  :rows="rows"
  :loading="loading"
  loadingLabel="Loading orders"
  emptyMessage="No orders today yet."
/>`,
    html: `<div class="ui-table-wrap" aria-busy="true">
  <table class="ui-table">
    ...
    <tbody>
      <tr><td class="ui-table__empty" colspan="5">No orders today yet.</td></tr>
    </tbody>
  </table>
  <div class="ui-table__loading" aria-hidden="true"><span class="ui-spinner"></span></div>
  <span class="ui-visually-hidden" role="status">Loading orders</span>
</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-data-table caption="الطلبات" [columns]="columns" [rows]="orders" rowKey="id" />
<ui-pagination [(page)]="page" [total]="23" [pageSize]="8" [labels]="labels" />

labels = {
  nav: 'التنقل بين الصفحات',
  previous: 'الصفحة السابقة',
  next: 'الصفحة التالية',
  page: (n: number) => \`صفحة \${n}\`,
  summary: (first: number, last: number, total: number) => \`\${first}–\${last} من \${total}\`,
};`,
    react: `<DataTable caption="الطلبات" columns={columns} rows={orders} rowKey="id" />
<Pagination page={page} onPageChange={setPage} total={23} pageSize={8} labels={labels} />`,
    vue: `<DataTable caption="الطلبات" :columns="columns" :rows="orders" rowKey="id" />
<Pagination v-model:page="page" :total="23" :page-size="8" :labels="labels" />`,
    html: `<!-- dir="rtl" on the page: columns, alignment and the arrows follow -->
<table class="ui-table">
  <caption class="ui-table__caption">الطلبات</caption>
  ...
</table>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A few label and value pairs',
      use: 'Property list',
      path: '/components/property-list',
    },
    {
      need: 'Events in time order',
      use: 'Timeline',
      path: '/components/timeline',
    },
    {
      need: 'Nested items such as folders',
      use: 'Tree',
      path: '/components/tree',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'caption',
        type: 'string',
        description: 'Required. Names the table; screen readers announce it.',
      },
      {
        name: 'hideCaption',
        type: 'boolean',
        default: 'false',
        description:
          'Keep the caption for screen readers only, when a heading above already names the table.',
      },
      {
        name: 'columns',
        type: 'TableColumn<T>[]',
        description:
          'Required. { key, header, sortable?, align?, value? } per column.',
      },
      {
        name: 'rows',
        type: 'T[]',
        description: 'Required. The rows of the current page.',
      },
      {
        name: 'sort',
        type: 'TableSort | null (model)',
        description:
          'Bind [(sort)]: { key, direction }. Sort the rows yourself.',
      },
      {
        name: 'rowKey',
        type: 'keyof T | (row) => unknown',
        description:
          'What identifies a row, so rows keep their state across updates.',
      },
      {
        name: 'loading / loadingLabel',
        type: 'boolean / string',
        default: "false / 'Loading'",
        description: 'Marks the table busy and reads the label once.',
      },
      {
        name: 'emptyMessage',
        type: 'string',
        default: "'No results'",
        description: 'Shown when there are no rows; pass the translated text.',
      },
      {
        name: 'ng-template uiCell="key"',
        type: 'directive',
        description: 'A custom cell for that column; let-row gives the row.',
      },
    ],
    react: [
      {
        name: 'caption',
        type: 'string',
        description: 'Required. Names the table; screen readers announce it.',
      },
      {
        name: 'hideCaption',
        type: 'boolean',
        default: 'false',
        description: 'Keep the caption for screen readers only.',
      },
      {
        name: 'columns',
        type: 'TableColumn<T>[]',
        description:
          'Required. { key, header, sortable?, align?, value?, cell? } per column.',
      },
      {
        name: 'rows',
        type: 'T[]',
        description: 'Required. The rows of the current page.',
      },
      {
        name: 'sort / onSortChange',
        type: 'TableSort | null / (sort) => void',
        description: 'The sort state, controlled. Sort the rows yourself.',
      },
      {
        name: 'rowKey',
        type: 'keyof T | (row) => Key',
        description: 'Used as the React key of each row.',
      },
      {
        name: 'loading / loadingLabel',
        type: 'boolean / string',
        default: "false / 'Loading'",
        description: 'Marks the table busy and reads the label once.',
      },
      {
        name: 'emptyMessage',
        type: 'string',
        default: "'No results'",
        description: 'Shown when there are no rows; pass the translated text.',
      },
    ],
    vue: [
      {
        name: 'caption',
        type: 'string',
        description: 'Required. Names the table; screen readers announce it.',
      },
      {
        name: 'hideCaption',
        type: 'boolean',
        default: 'false',
        description: 'Keep the caption for screen readers only.',
      },
      {
        name: 'columns',
        type: 'TableColumn<T>[]',
        description:
          'Required. { key, header, sortable?, align?, value? } per column; a #cell-<key> slot gets { row } and replaces the text.',
      },
      {
        name: 'rows',
        type: 'T[]',
        description: 'Required. The rows of the current page.',
      },
      {
        name: 'v-model:sort',
        type: 'TableSort | null',
        description: 'The sort state, controlled. Sort the rows yourself.',
      },
      {
        name: 'rowKey',
        type: 'keyof T | (row) => Key',
        description: 'Used as the React key of each row.',
      },
      {
        name: 'loading / loadingLabel',
        type: 'boolean / string',
        default: "false / 'Loading'",
        description: 'Marks the table busy and reads the label once.',
      },
      {
        name: 'emptyMessage',
        type: 'string',
        default: "'No results'",
        description: 'Shown when there are no rows; pass the translated text.',
      },
    ],
    html: [
      {
        name: 'ui-table-wrap',
        type: 'class',
        description:
          'Scrolls sideways on narrow screens. If it can scroll, add tabindex="0", role="region" and aria-labelledby the caption.',
      },
      {
        name: 'table.ui-table + caption.ui-table__caption',
        type: 'element + class',
        description:
          'The table and its name. Add ui-visually-hidden to the caption to hide it visually.',
      },
      {
        name: 'th scope="col"',
        type: 'attribute',
        description: 'On every header cell.',
      },
      {
        name: 'aria-sort + button.ui-table__sort',
        type: 'attribute + class',
        description: 'On sortable headers: ascending, descending or none.',
      },
      {
        name: 'ui-table__cell--end | --center',
        type: 'class',
        description: 'Alignment, on the th and every td of the column.',
      },
      {
        name: 'ui-table__empty, ui-table__loading',
        type: 'class',
        description:
          'The empty row, and the loading overlay with a status message.',
      },
    ],
  };
}
