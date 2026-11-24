# Data table

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Rows of records the reader scans and compares: orders, users, payments. A real table, named by its caption, so screen readers announce the row and column of every cell. Sorting is announced too.

Docs: https://ghazal-ui.github.io/ghazal/components/data-table

```html
<div class="ui-table-wrap">
  <table class="ui-table">
    <caption class="ui-table__caption">Orders</caption>
    ...
  </table>
</div>
```

When to use something else:

- A few label and value pairs: [Property list](https://ghazal-ui.github.io/ghazal/components/property-list)
- Events in time order: [Timeline](https://ghazal-ui.github.io/ghazal/components/timeline)
- Nested items such as folders: [Tree](https://ghazal-ui.github.io/ghazal/components/tree)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-table-wrap` | `class` |  | Scrolls sideways on narrow screens. If it can scroll, add tabindex="0", role="region" and aria-labelledby the caption. |
| `table.ui-table + caption.ui-table__caption` | `element + class` |  | The table and its name. Add ui-visually-hidden to the caption to hide it visually. |
| `th scope="col"` | `attribute` |  | On every header cell. |
| `aria-sort + button.ui-table__sort` | `attribute + class` |  | On sortable headers: ascending, descending or none. |
| `ui-table__cell--end \| --center` | `class` |  | Alignment, on the th and every td of the column. |
| `ui-table__empty, ui-table__loading` | `class` |  | The empty row, and the loading overlay with a status message. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Enter or Space: On a column heading, sort by it.
- A real table named by its caption, so the row and column of every cell are read.
- The sorted column is marked, and the new order is announced.

## Examples

### Sorting, custom cells and pagination

Sort by customer, date or total. Status is a badge; totals line up on the last digit. The table only reports the sort: the page sorts and slices the rows, usually on the server.

```html
<div class="ui-table-wrap">
  <table class="ui-table">
    <caption class="ui-table__caption">Orders</caption>
    <thead>
      <tr>
        <th scope="col">Order</th>
        <th scope="col" aria-sort="none">
          <button type="button" class="ui-table__sort">Customer <i class="ui-icon ui-icon-chevrons-up-down ui-table__sort-icon" aria-hidden="true"></i></button>
        </th>
        <th scope="col" aria-sort="descending">
          <button type="button" class="ui-table__sort">Placed <i class="ui-icon ui-icon-chevron-down ui-table__sort-icon" aria-hidden="true"></i></button>
        </th>
        <th scope="col" class="ui-table__cell--end">Total</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>#1040</td>
        <td>Hatem Mohamed</td>
        <td>2026-11-18</td>
        <td class="ui-table__cell--end">85 EGP</td>
        <td><span class="ui-badge ui-badge--success">Paid</span></td>
      </tr>
    </tbody>
  </table>
</div>
<!-- Sorting needs a small script: sort the rows on click and update aria-sort on the th. -->
```

### Empty and loading

Say why the table is empty in words. While loading, the table is marked busy and screen readers hear the loading text once.

```html
<div class="ui-table-wrap" aria-busy="true">
  <table class="ui-table">
    ...
    <tbody>
      <tr><td class="ui-table__empty" colspan="5">No orders today yet.</td></tr>
    </tbody>
  </table>
  <div class="ui-table__loading" aria-hidden="true"><span class="ui-spinner"></span></div>
  <span class="ui-visually-hidden" role="status">Loading orders</span>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page: columns, alignment and the arrows follow -->
<table class="ui-table">
  <caption class="ui-table__caption">الطلبات</caption>
  ...
</table>
```
