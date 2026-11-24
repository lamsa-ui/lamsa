# Navigation

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The app's main links, in a side bar. A named navigation landmark, links at least 44px tall, and the current page marked with a bar and bold text, not only a fill. On a phone, put the same links in a drawer.

Docs: https://lamsa-ui.github.io/lamsa/components/nav

```ts
import { NavComponent } from '@lamsa-ui/angular';
// Mark the current link with routerLinkActive ariaCurrentWhenActive="page".
```

When to use something else:

- A whole app layout with header and side bar: [App shell](https://lamsa-ui.github.io/lamsa/components/app-shell)
- Views of one page: [Tabs](https://lamsa-ui.github.io/lamsa/components/tabs)
- Where the page sits in the site: [Breadcrumbs](https://lamsa-ui.github.io/lamsa/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the landmark, so it differs from other navigation. |
| `content` | `ul, h2` |  | Lists of links, with optional group titles. |

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
