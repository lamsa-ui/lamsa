# Breadcrumbs

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Where the page sits, as a trail of links back up. A named navigation landmark around an ordered list; the last item is the page itself, marked as current and not a link. The slashes are drawn, not read out.

Docs: https://lamsa-ui.github.io/lamsa/components/breadcrumbs

```tsx
import { Breadcrumbs } from '@lamsa-ui/react';
```

When to use something else:

- The main links of the app: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Steps of a task in order: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)
- Pages of a long list: [Pagination](https://lamsa-ui.github.io/lamsa/components/pagination)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` | `'Breadcrumb'` | Names the landmark, translated. |
| `children` | `<li> elements` |  | One per step; the last holds aria-current="page". |

Keyboard and screen readers:

- A named navigation landmark around an ordered list; the last item is marked as the current page.
- The slashes are drawn, not read out.

## Examples

### An order

```tsx
<Breadcrumbs>
  <li><a href="/">Home</a></li>
  <li><a href="/orders">Orders</a></li>
  <li><span aria-current="page">Order 1042</span></li>
</Breadcrumbs>
```

### In Arabic

```tsx
<Breadcrumbs label="مسار الصفحة">…</Breadcrumbs>
```
