# Navigation

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

The app's main links, in a side bar. A named navigation landmark, links at least 44px tall, and the current page marked with a bar and bold text, not only a fill. On a phone, put the same links in a drawer.

Docs: https://ghazal-ui.github.io/ghazal/components/nav

```ts
import { NavComponent } from '@ghazal-ui/angular';
// Mark the current link with routerLinkActive ariaCurrentWhenActive="page".
```

When to use something else:

- A whole app layout with header and side bar: [App shell](https://ghazal-ui.github.io/ghazal/components/app-shell)
- Views of one page: [Tabs](https://ghazal-ui.github.io/ghazal/components/tabs)
- Where the page sits in the site: [Breadcrumbs](https://ghazal-ui.github.io/ghazal/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the landmark, so it differs from other navigation. |
| `content` | `ul, h2` |  | Lists of links, with optional group titles. |

Keyboard and screen readers:

- A named navigation landmark; the current page is marked for screen readers and with a bar and bold text.

## Examples

### A side bar

```html
<ui-nav label="Main">
  <h2 class="ui-nav__title ui-label">Sales</h2>
  <ul>
    <li><a routerLink="/orders" routerLinkActive ariaCurrentWhenActive="page">Orders</a></li>
    <li><a routerLink="/invoices" routerLinkActive ariaCurrentWhenActive="page">Invoices</a></li>
  </ul>
</ui-nav>
```

### In Arabic

```html
<ui-nav label="الرئيسية">…</ui-nav>
```
