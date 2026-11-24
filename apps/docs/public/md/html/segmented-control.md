# Segmented control

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

One choice from two to five short options, side by side: a view, a period, a size. Radio buttons underneath, so Tab reaches the group and the arrow keys move the choice. The chosen one is lifted onto a tile with an edge, not just coloured.

Docs: https://ghazal-ui.github.io/ghazal/components/segmented-control

```html
<div class="ui-segmented" role="radiogroup" aria-label="Period">...</div>
```

When to use something else:

- Show different panels of content: [Tabs](https://ghazal-ui.github.io/ghazal/components/tabs)
- A choice sent with a form: [Radio group](https://ghazal-ui.github.io/ghazal/components/radio-group)
- One option that is on or off: [Toggle](https://ghazal-ui.github.io/ghazal/components/toggle)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-segmented` | `class` |  | The track, with role="radiogroup" and a name. |
| `ui-segmented__option` | `class` |  | One label around a radio; the radio fills it, unseen. |
| `ui-segmented--block` | `class` |  | Full width. |

Keyboard and screen readers:

- Tab: Reach the group, on the chosen option.
- Arrow keys: Move the choice to the next or previous option.
- Radio buttons underneath; the chosen option is lifted onto a tile with an edge, not only coloured.

## Examples

### A period

```html
<div class="ui-segmented" role="radiogroup" aria-label="Period">
  <label class="ui-segmented__option"><input type="radio" name="period" value="day" />Day</label>
  <label class="ui-segmented__option"><input type="radio" name="period" value="week" checked />Week</label>
  <label class="ui-segmented__option"><input type="radio" name="period" value="month" />Month</label>
</div>
```

### Icons only

The words stay for screen readers. Keep icons that everyone reads the same way.

```html
<label class="ui-segmented__option">
  <input type="radio" name="view" value="list" checked />
  <i class="ui-icon ui-icon-list" aria-hidden="true"></i>
  <span class="ui-visually-hidden">List</span>
</label>
```

### Full width

block shares the width equally, as in a narrow panel or on a phone.

```html
<div class="ui-segmented ui-segmented--block" role="radiogroup" aria-label="Delivery">…</div>
```

### In Arabic

```html
<!-- dir="rtl": the first segment sits on the right. -->
```
