# Data table

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Rows of records the reader scans and compares: orders, users, payments. A real table, named by its caption, so screen readers announce the row and column of every cell. Sorting is announced too.

Docs: https://lamsa-ui.github.io/lamsa/components/data-table

```tsx
import { DataTable, type TableColumn, type TableSort } from '@lamsa-ui/react';
```

When to use something else:

- A few label and value pairs: [Property list](https://lamsa-ui.github.io/lamsa/components/property-list)
- Events in time order: [Timeline](https://lamsa-ui.github.io/lamsa/components/timeline)
- Nested items such as folders: [Tree](https://lamsa-ui.github.io/lamsa/components/tree)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `caption` | `string` |  | Required. Names the table; screen readers announce it. |
| `hideCaption` | `boolean` | `false` | Keep the caption for screen readers only. |
| `columns` | `TableColumn<T>[]` |  | Required. { key, header, sortable?, align?, value?, cell? } per column. |
| `rows` | `T[]` |  | Required. The rows of the current page. |
| `sort / onSortChange` | `TableSort \| null / (sort) => void` |  | The sort state, controlled. Sort the rows yourself. |
| `rowKey` | `keyof T \| (row) => Key` |  | Used as the React key of each row. |
| `loading / loadingLabel` | `boolean / string` | `false / 'Loading'` | Marks the table busy and reads the label once. |
| `emptyMessage` | `string` | `'No results'` | Shown when there are no rows; pass the translated text. |

## Examples

### Sorting, custom cells and pagination

Sort by customer, date or total. Status is a badge; totals line up on the last digit. The table only reports the sort: the page sorts and slices the rows, usually on the server.

```tsx
const columns: TableColumn<Order>[] = [
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
</Card>
```

### Empty and loading

Say why the table is empty in words. While loading, the table is marked busy and screen readers hear the loading text once.

```tsx
<DataTable
  caption="Orders today"
  columns={columns}
  rows={rows}
  loading={loading}
  loadingLabel="Loading orders"
  emptyMessage="No orders today yet."
/>
```

### In Arabic

```tsx
<DataTable caption="الطلبات" columns={columns} rows={orders} rowKey="id" />
<Pagination page={page} onPageChange={setPage} total={23} pageSize={8} labels={labels} />
```
