# Pagination

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Moves through long lists a page at a time. A named navigation landmark: each page button says its number, the current page is marked, and the line of shown rows is announced when it changes.

Docs: https://ghazal-ui.github.io/ghazal/components/pagination

```html
<nav class="ui-pagination" aria-label="Pagination">...</nav>
```

When to use something else:

- Steps of a task: [Stepper](https://ghazal-ui.github.io/ghazal/components/stepper)
- Where the page sits in the site: [Breadcrumbs](https://ghazal-ui.github.io/ghazal/components/breadcrumbs)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `nav.ui-pagination + aria-label` | `element + class` |  | A named navigation landmark. |
| `ui-pagination__summary role="status"` | `class + attribute` |  | Which rows are shown, announced when it changes. |
| `ui-pagination__page + aria-label + aria-current` | `class + attribute` |  | Name every page button, and mark the current one with aria-current="page". |
| `ui-pagination__step + aria-disabled` | `class + attribute` |  | Previous and next; at the ends use aria-disabled="true", not disabled. |
| `ui-pagination__gap aria-hidden` | `class + attribute` |  | The "…" between page numbers. |

Keyboard and screen readers:

- Tab: Move between the page buttons.
- A named navigation landmark; each button says its page number, and the current page is marked.
- The line of shown rows is announced when it changes.

## Examples

### Pages

The first and last page, the current one and its neighbours. Previous and next stay focusable at the ends, so focus never jumps away. On a phone only the arrows and the current page show.

```html
<nav class="ui-pagination" aria-label="Pagination">
  <p class="ui-pagination__summary" role="status">41–50 of 230</p>
  <ul class="ui-pagination__list">
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__step" aria-label="Previous page">
      <i class="ui-icon ui-icon-chevron-left ui-pagination__arrow" aria-hidden="true"></i></button></li>
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__page" aria-label="Page 1">1</button></li>
    <li><span class="ui-pagination__gap" aria-hidden="true">…</span></li>
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__page" aria-label="Page 5" aria-current="page">5</button></li>
    ...
    <li><button type="button" class="ui-button ui-button--ghost ui-button--sm ui-pagination__step" aria-label="Next page">
      <i class="ui-icon ui-icon-chevron-right ui-pagination__arrow" aria-hidden="true"></i></button></li>
  </ul>
</nav>
<!-- At the first or last page: aria-disabled="true" on the arrow, not disabled, so it keeps focus. -->
```

### Rows per page

Changing the size goes back to page 1, so the reader never lands on a page that no longer exists. Two paginations on one page need different names, so this one is called Order pages.

```html
<div class="ui-pagination__size">
  <span>Rows per page</span>
  <button type="button" class="ui-button ui-button--secondary ui-button--md" aria-label="Rows per page: 10">
    10
    <i class="ui-icon ui-icon-chevron-down ui-select__chevron" aria-hidden="true"></i>
  </button>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page: the arrows turn round by themselves -->
<nav class="ui-pagination" aria-label="التنقل بين الصفحات">...</nav>
```
