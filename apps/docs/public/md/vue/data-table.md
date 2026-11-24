# Data table

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Rows of records the reader scans and compares: orders, users, payments. A real table, named by its caption, so screen readers announce the row and column of every cell. Sorting is announced too.

Docs: https://lamsa-ui.github.io/lamsa/components/data-table

```ts
import { DataTable, type TableColumn, type TableSort } from '@lamsa-ui/vue';
```

When to use something else:

- A few label and value pairs: [Property list](https://lamsa-ui.github.io/lamsa/components/property-list)
- Events in time order: [Timeline](https://lamsa-ui.github.io/lamsa/components/timeline)
- Nested items such as folders: [Tree](https://lamsa-ui.github.io/lamsa/components/tree)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `caption` | `string` |  | Required. Names the table; screen readers announce it. |
| `hideCaption` | `boolean` | `false` | Keep the caption for screen readers only. |
| `columns` | `TableColumn<T>[]` |  | Required. { key, header, sortable?, align?, value? } per column; a #cell-<key> slot gets { row } and replaces the text. |
| `rows` | `T[]` |  | Required. The rows of the current page. |
| `v-model:sort` | `TableSort \| null` |  | The sort state, controlled. Sort the rows yourself. |
| `rowKey` | `keyof T \| (row) => Key` |  | Used as the React key of each row. |
| `loading / loadingLabel` | `boolean / string` | `false / 'Loading'` | Marks the table busy and reads the label once. |
| `emptyMessage` | `string` | `'No results' from labels` | Shown when there are no rows; pass the translated text. |

Keyboard and screen readers:

- Enter or Space: On a column heading, sort by it.
- A real table named by its caption, so the row and column of every cell are read.
- The sorted column is marked, and the new order is announced.

## Examples

### Sorting, custom cells and pagination

Sort by customer, date or total. Status is a badge; totals line up on the last digit. The table only reports the sort: the page sorts and slices the rows, usually on the server.

```vue
<script setup lang="ts">
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
</template>
```

### Empty and loading

Say why the table is empty in words. While loading, the table is marked busy and screen readers hear the loading text once.

```vue
<DataTable
  caption="Orders today"
  :columns="columns"
  :rows="rows"
  :loading="loading"
  loadingLabel="Loading orders"
  emptyMessage="No orders today yet."
/>
```

### In Arabic

```vue
<DataTable caption="الطلبات" :columns="columns" :rows="orders" rowKey="id" />
<Pagination v-model:page="page" :total="23" :page-size="8" :labels="labels" />
```
