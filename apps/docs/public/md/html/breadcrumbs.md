# Breadcrumbs

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Where the page sits, as a trail of links back up. A named navigation landmark around an ordered list; the last item is the page itself, marked as current and not a link. The slashes are drawn, not read out.

Docs: https://lamsa-ui.github.io/lamsa/components/breadcrumbs

```html
<nav class="ui-breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/orders">Orders</a></li>
    <li><span aria-current="page">Order 1042</span></li>
  </ol>
</nav>
```

When to use something else:

- The main links of the app: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Steps of a task in order: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)
- Pages of a long list: [Pagination](https://lamsa-ui.github.io/lamsa/components/pagination)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-breadcrumbs` | `class` |  | On a nav with aria-label, around an ol. |
| `aria-current="page"` | `attribute` |  | On the last item, which is not a link. |

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
