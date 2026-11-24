# Empty state

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

What a list, table or page shows while it has nothing in it. It says what will appear here, why it is empty now, and offers the one action that fills it.

Docs: https://ghazal-ui.github.io/ghazal/components/empty-state

```html
<div class="ui-empty-state">...</div>
```

When to use something else:

- Content that is still loading: [Skeleton](https://ghazal-ui.github.io/ghazal/components/skeleton)
- Something went wrong: [Alert](https://ghazal-ui.github.io/ghazal/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-empty-state` | `class` |  | Required. Centres its content. |
| `ui-empty-state__title` | `class` |  | On the heading. |
| `ui-empty-state__actions` | `class` |  | Around the buttons. |

Keyboard and screen readers:

- Its title is a heading, at the level you set so it fits the page outline.

## Examples

### First use

Nothing has been made yet: name what goes here and give the action that makes the first one.

```html
<div class="ui-empty-state">
  <h3 class="ui-empty-state__title">No orders yet</h3>
  <p>Orders show here as soon as a customer pays.</p>
  <div class="ui-empty-state__actions">
    <button class="ui-button ui-button--primary">Share your menu</button>
  </div>
</div>
```

### No results

A search or filter matched nothing: say so, and give the way back.

```html
<div class="ui-empty-state">
  <h3 class="ui-empty-state__title">No orders match “Mohamed”</h3>
  <p>Check the spelling, or search by order number.</p>
  <div class="ui-empty-state__actions">
    <button class="ui-button ui-button--secondary">Clear search</button>
  </div>
</div>
```

### In Arabic

```html
<div class="ui-empty-state">
  <h3 class="ui-empty-state__title">لا توجد طلبات بعد</h3>
  <p>تظهر الطلبات هنا بمجرد أن يدفع العميل.</p>
</div>
```
