# Navigation

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The app's main links, in a side bar. A named navigation landmark, links at least 44px tall, and the current page marked with a bar and bold text, not only a fill. On a phone, put the same links in a drawer.

Docs: https://lamsa-ui.github.io/lamsa/components/nav

```html
<nav class="ui-nav" aria-label="Main">
  <ul>
    <li><a href="/orders" aria-current="page">Orders</a></li>
    <li><a href="/invoices">Invoices</a></li>
  </ul>
</nav>
```

When to use something else:

- A whole app layout with header and side bar: [App shell](https://lamsa-ui.github.io/lamsa/components/app-shell)
- Views of one page: [Tabs](https://lamsa-ui.github.io/lamsa/components/tabs)
- Where the page sits in the site: [Breadcrumbs](https://lamsa-ui.github.io/lamsa/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-nav` | `class` |  | On a nav with aria-label. |
| `ui-nav__title` | `class` |  | A group title; add ui-label for the mono caps. |
| `aria-current="page"` | `attribute` |  | On the current page's link. |

Keyboard and screen readers:

- A named navigation landmark; the current page is marked for screen readers and with a bar and bold text.

## Examples

### A side bar

```html
<nav class="ui-nav" aria-label="Main">
  <h2 class="ui-nav__title ui-label">Sales</h2>
  <ul>
    <li><a href="/orders" aria-current="page">Orders</a></li>
    <li><a href="/invoices">Invoices</a></li>
  </ul>
</nav>
```

### In Arabic

```html
<!-- dir="rtl" on the page: the current page's bar moves to the right -->
```
