# Pagination

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Moves through long lists a page at a time. A named navigation landmark: each page button says its number, the current page is marked, and the line of shown rows is announced when it changes.

Docs: https://lamsa-ui.github.io/lamsa/components/pagination

```ts
import { PaginationComponent } from '@lamsa-ui/angular';
```

When to use something else:

- Steps of a task: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)
- Where the page sits in the site: [Breadcrumbs](https://lamsa-ui.github.io/lamsa/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `page` | `number (model)` |  | Required. The current page, from 1. Bind [(page)]. |
| `total` | `number` |  | Required. Rows across all pages. |
| `pageSize` | `number (model)` | `10` | Rows per page. Bind [(pageSize)] with a picker. |
| `pageSizes` | `number[]` | `[]` | Offer these sizes in a picker. Empty: no picker. |
| `labels` | `Partial<PaginationLabels>` |  | Translated texts: nav, previous, next, page(n), summary(first, last, total), pageSize. |

Keyboard and screen readers:

- Tab: Move between the page buttons.
- A named navigation landmark; each button says its page number, and the current page is marked.
- The line of shown rows is announced when it changes.

## Examples

### Pages

The first and last page, the current one and its neighbours. Previous and next stay focusable at the ends, so focus never jumps away. On a phone only the arrows and the current page show.

```html
page = signal(5);

<ui-pagination [(page)]="page" [total]="230" [pageSize]="10" />
```

### Rows per page

Changing the size goes back to page 1, so the reader never lands on a page that no longer exists. Two paginations on one page need different names, so this one is called Order pages.

```html
<ui-pagination
  [(page)]="page"
  [(pageSize)]="pageSize"
  [total]="42"
  [pageSizes]="[10, 20, 50]"
  [labels]="{ nav: 'Order pages' }"
/>
```

### In Arabic

```html
labels = {
  nav: 'التنقل بين الصفحات',
  previous: 'الصفحة السابقة',
  next: 'الصفحة التالية',
  page: (n: number) => `صفحة ${n}`,
  summary: (first: number, last: number, total: number) => `${first}–${last} من ${total}`,
  pageSize: 'عدد الصفوف',
};

<ui-pagination [(page)]="page" [total]="230" [pageSize]="10" [labels]="labels" />
```
