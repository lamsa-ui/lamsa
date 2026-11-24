# Navigation

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

The app's main links, in a side bar. A named navigation landmark, links at least 44px tall, and the current page marked with a bar and bold text, not only a fill. On a phone, put the same links in a drawer.

Docs: https://ghazal-ui.github.io/ghazal/components/nav

```ts
import { Nav } from '@ghazal-ui/vue';
```

When to use something else:

- A whole app layout with header and side bar: [App shell](https://ghazal-ui.github.io/ghazal/components/app-shell)
- Views of one page: [Tabs](https://ghazal-ui.github.io/ghazal/components/tabs)
- Where the page sits in the site: [Breadcrumbs](https://ghazal-ui.github.io/ghazal/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the landmark. |

Keyboard and screen readers:

- A named navigation landmark; the current page is marked for screen readers and with a bar and bold text.

## Examples

### A side bar

```vue
<Nav label="Main">
  <h2 class="ui-nav__title ui-label">Sales</h2>
  <ul>
    <li><a href="/orders" :aria-current="page === 'orders' ? 'page' : undefined">Orders</a></li>
    <li><a href="/invoices">Invoices</a></li>
  </ul>
</Nav>
```

### In Arabic

```vue
<Nav label="الرئيسية">…</Nav>
```
