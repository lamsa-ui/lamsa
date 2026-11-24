# Card

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A surface that groups related content: a summary, a list, a form. Cards are flat, with a thin border; shadows are kept for things that float, like menus and dialogs.

Docs: https://lamsa-ui.github.io/lamsa/components/card

```html
<div class="ui-card">...</div>
```

When to use something else:

- Separate two groups with a line only: [Divider](https://lamsa-ui.github.io/lamsa/components/divider)
- Label and value pairs, such as order details: [Property list](https://lamsa-ui.github.io/lamsa/components/property-list)
- One number and how it changed: [Stat](https://lamsa-ui.github.io/lamsa/components/stat)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-card` | `class` |  | Required. Stacks its children with a 1rem gap. |
| `ui-card--lg` | `class` |  | More padding. |
| `ui-card__title` | `class` |  | On the heading (h2 to h4, to fit the page). |

Keyboard and screen readers:

- A card with a heading reads as its own part of the page; give it one when it stands alone.

## Examples

### With a title

Set the heading level so the title fits the page: level 2 under the page title, level 3 inside a section.

```html
<div class="ui-card">
  <h3 class="ui-card__title">Order #1042</h3>
  <p>2 items · 340 EGP</p>
  <span class="ui-badge ui-badge--success">Paid</span>
</div>
```

### Roomy

More padding, for a card that stands alone on a page.

```html
<div class="ui-card ui-card--lg">
  <h2 class="ui-card__title">Today</h2>
  <p>18 orders, 3 still in the kitchen.</p>
</div>
```

### In Arabic

```html
<div class="ui-card">
  <h3 class="ui-card__title">طلب رقم ١٠٤٢</h3>
  <p>صنفين · ٣٤٠ جنيه</p>
</div>
```
