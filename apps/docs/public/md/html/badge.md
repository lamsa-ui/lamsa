# Badge

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A short status label, such as the state of an order. The words carry the meaning and the colour only repeats it, so every status reads the same without colour.

Docs: https://ghazal-ui.github.io/ghazal/components/badge

```html
<span class="ui-badge ui-badge--success">Paid</span>
```

When to use something else:

- A label the user added or can remove, such as a filter: [Tag](https://ghazal-ui.github.io/ghazal/components/tag)
- A live state such as online or offline: [Status dot](https://ghazal-ui.github.io/ghazal/components/status-dot)
- A message the reader must read: [Alert](https://ghazal-ui.github.io/ghazal/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-badge` | `class` |  | Required. On its own it is the neutral badge. |
| `ui-badge--info \| --success \| --warning \| --danger` | `class` |  | The colour. Use one at most. |

Keyboard and screen readers:

- The words carry the status; the colour only repeats them.

## Examples

### Variants

Each pair of text and fill passes 7:1 in both themes. Danger uses brand red, so keep it for problems.

```html
<span class="ui-badge">Draft</span>
<span class="ui-badge ui-badge--info">New</span>
<span class="ui-badge ui-badge--success">Paid</span>
<span class="ui-badge ui-badge--warning">Late</span>
<span class="ui-badge ui-badge--danger">Cancelled</span>
```

### In Arabic

```html
<span class="ui-badge ui-badge--success">مدفوع</span>
<span class="ui-badge ui-badge--warning">متأخر</span>
```
