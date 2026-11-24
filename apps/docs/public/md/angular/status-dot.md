# Status dot

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A small coloured dot before the word for a live state: online, busy, offline. The word is always there and carries the meaning; the dot lets the eye scan a long list.

Docs: https://ghazal-ui.github.io/ghazal/components/status-dot

```ts
import { StatusDotComponent } from '@ghazal-ui/angular';
```

When to use something else:

- A status that stands out in a table row, such as Paid: [Badge](https://ghazal-ui.github.io/ghazal/components/badge)
- A message about the status: [Alert](https://ghazal-ui.github.io/ghazal/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Colour of the dot. The words still say the status. |
| `content` | `text` |  | Required in practice: the word for the status. |

Keyboard and screen readers:

- The word is always there and carries the meaning; the dot is not read.

## Examples

### Tones

```html
<ui-status-dot tone="success">Online</ui-status-dot>
<ui-status-dot tone="warning">Busy</ui-status-dot>
<ui-status-dot tone="danger">Down</ui-status-dot>
<ui-status-dot tone="info">Syncing</ui-status-dot>
<ui-status-dot>Offline</ui-status-dot>
```

### In Arabic

```html
<ui-status-dot tone="success">متصل</ui-status-dot>
```
