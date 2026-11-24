# Badge

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A short status label, such as the state of an order. The words carry the meaning and the colour only repeats it, so every status reads the same without colour.

Docs: https://ghazal-ui.github.io/ghazal/components/badge

```tsx
import { Badge } from '@ghazal-ui/react';
```

When to use something else:

- A label the user added or can remove, such as a filter: [Tag](https://ghazal-ui.github.io/ghazal/components/tag)
- A live state such as online or offline: [Status dot](https://ghazal-ui.github.io/ghazal/components/status-dot)
- A message the reader must read: [Alert](https://ghazal-ui.github.io/ghazal/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `variant` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | The colour. The text must say the status too. |
| `...props` | `span props` |  | Every native span prop: id, title, ref. |

Keyboard and screen readers:

- The words carry the status; the colour only repeats them.

## Examples

### Variants

Each pair of text and fill passes 7:1 in both themes. Danger uses brand red, so keep it for problems.

```tsx
<Badge>Draft</Badge>
<Badge variant="info">New</Badge>
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Late</Badge>
<Badge variant="danger">Cancelled</Badge>
```

### In Arabic

```tsx
<Badge variant="success">مدفوع</Badge>
<Badge variant="warning">متأخر</Badge>
```
