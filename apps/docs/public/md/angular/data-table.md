# Data table

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Rows of records the reader scans and compares: orders, users, payments. A real table, named by its caption, so screen readers announce the row and column of every cell. Sorting is announced too.

Docs: https://lamsa-ui.github.io/lamsa/components/data-table

```ts
import {
  DataTableComponent,
  TableCellDirective,
  type TableColumn,
  type TableSort,
} from '@lamsa-ui/angular';
```

When to use something else:

- A few label and value pairs: [Property list](https://lamsa-ui.github.io/lamsa/components/property-list)
- Events in time order: [Timeline](https://lamsa-ui.github.io/lamsa/components/timeline)
- Nested items such as folders: [Tree](https://lamsa-ui.github.io/lamsa/components/tree)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `caption` | `string` |  | Required. Names the table; screen readers announce it. |
| `hideCaption` | `boolean` | `false` | Keep the caption for screen readers only, when a heading above already names the table. |
| `columns` | `TableColumn<T>[]` |  | Required. { key, header, sortable?, align?, value? } per column. |
| `rows` | `T[]` |  | Required. The rows of the current page. |
| `sort` | `TableSort \| null (model)` |  | Bind [(sort)]: { key, direction }. Sort the rows yourself. |
| `rowKey` | `keyof T \| (row) => unknown` |  | What identifies a row, so rows keep their state across updates. |
| `loading / loadingLabel` | `boolean / string` | `false / 'Loading'` | Marks the table busy and reads the label once. |
| `emptyMessage` | `string` | `'No results'` | Shown when there are no rows; pass the translated text. |
| `ng-template uiCell="key"` | `directive` |  | A custom cell for that column; let-row gives the row. |

## Examples

### Sorting, custom cells and pagination

Sort by customer, date or total. Status is a badge; totals line up on the last digit. The table only reports the sort: the page sorts and slices the rows, usually on the server.

```html
columns: TableColumn<Order>[] = [
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
</ui-card>
```

### Empty and loading

Say why the table is empty in words. While loading, the table is marked busy and screen readers hear the loading text once.

```html
<ui-data-table
  caption="Orders today"
  [columns]="columns"
  [rows]="rows()"
  [loading]="loading()"
  loadingLabel="Loading orders"
  emptyMessage="No orders today yet."
/>
```

### In Arabic

```html
<ui-data-table caption="الطلبات" [columns]="columns" [rows]="orders" rowKey="id" />
<ui-pagination [(page)]="page" [total]="23" [pageSize]="8" [labels]="labels" />

labels = {
  nav: 'التنقل بين الصفحات',
  previous: 'الصفحة السابقة',
  next: 'الصفحة التالية',
  page: (n: number) => `صفحة ${n}`,
  summary: (first: number, last: number, total: number) => `${first}–${last} من ${total}`,
};
```
