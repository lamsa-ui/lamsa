# Breadcrumbs

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Where the page sits, as a trail of links back up. A named navigation landmark around an ordered list; the last item is the page itself, marked as current and not a link. The slashes are drawn, not read out.

Docs: https://ghazal-ui.github.io/ghazal/components/breadcrumbs

```html
<nav class="ui-breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/orders">Orders</a></li>
    <li><span aria-current="page">Order 1042</span></li>
  </ol>
</nav>
```

When to use something else:

- The main links of the app: [Navigation](https://ghazal-ui.github.io/ghazal/components/nav)
- Steps of a task in order: [Stepper](https://ghazal-ui.github.io/ghazal/components/stepper)
- Pages of a long list: [Pagination](https://ghazal-ui.github.io/ghazal/components/pagination)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-breadcrumbs` | `class` |  | On a nav with aria-label, around an ol. |
| `aria-current="page"` | `attribute` |  | On the last item, which is not a link. |

Keyboard and screen readers:

- A named navigation landmark around an ordered list; the last item is marked as the current page.
- The slashes are drawn, not read out.

## Examples

### An order

```html
<nav class="ui-breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/orders">Orders</a></li>
    <li><span aria-current="page">Order 1042</span></li>
  </ol>
</nav>
```

### In Arabic

```html
<nav class="ui-breadcrumbs" aria-label="مسار الصفحة">…</nav>
```
