# Pagination

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Moves through long lists a page at a time. A named navigation landmark: each page button says its number, the current page is marked, and the line of shown rows is announced when it changes.

Docs: https://ghazal-ui.github.io/ghazal/components/pagination

```ts
import { Pagination } from '@ghazal-ui/vue';
```

When to use something else:

- Steps of a task: [Stepper](https://ghazal-ui.github.io/ghazal/components/stepper)
- Where the page sits in the site: [Breadcrumbs](https://ghazal-ui.github.io/ghazal/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `v-model:page` | `number` |  | Required. The current page, from 1. |
| `total` | `number` |  | Required. Rows across all pages. |
| `v-model:pageSize` | `number` | `10` | Rows per page; a new size also calls onPageChange(1). |
| `pageSizes` | `number[]` | `[]` | Offer these sizes in a picker. Empty: no picker. |
| `labels` | `Partial<PaginationLabels>` |  | Translated texts: nav, previous, next, page(n), summary(first, last, total), pageSize. |

Keyboard and screen readers:

- Tab: Move between the page buttons.
- A named navigation landmark; each button says its page number, and the current page is marked.
- The line of shown rows is announced when it changes.

## Examples

### Pages

The first and last page, the current one and its neighbours. Previous and next stay focusable at the ends, so focus never jumps away. On a phone only the arrows and the current page show.

```vue
<script setup lang="ts">
import { ref } from 'vue';
const page = ref(5);
</script>

<template>
  <Pagination v-model:page="page" :total="230" :page-size="10" />
</template>
```

### Rows per page

Changing the size goes back to page 1, so the reader never lands on a page that no longer exists. Two paginations on one page need different names, so this one is called Order pages.

```vue
<Pagination
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="42"
  :page-sizes="[10, 20, 50]"
  :labels="{ nav: 'Order pages' }"
/>
```

### In Arabic

```vue
<Pagination v-model:page="page" :total="230" :page-size="10" :labels="labels" />
```
