# Status dot

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A small coloured dot before the word for a live state: online, busy, offline. The word is always there and carries the meaning; the dot lets the eye scan a long list.

Docs: https://lamsa-ui.github.io/lamsa/components/status-dot

```ts
import { StatusDot } from '@lamsa-ui/vue';
```

When to use something else:

- A status that stands out in a table row, such as Paid: [Badge](https://lamsa-ui.github.io/lamsa/components/badge)
- A message about the status: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Colour of the dot. The words still say the status. |
| `#default` | `slot` |  | The word for the status. |

Keyboard and screen readers:

- The word is always there and carries the meaning; the dot is not read.

## Examples

### Tones

```vue
<StatusDot tone="success">Online</StatusDot>
<StatusDot tone="warning">Busy</StatusDot>
<StatusDot tone="danger">Down</StatusDot>
<StatusDot tone="info">Syncing</StatusDot>
<StatusDot>Offline</StatusDot>
```

### In Arabic

```vue
<StatusDot tone="success">متصل</StatusDot>
```
