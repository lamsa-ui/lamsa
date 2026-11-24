# Popover

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A small panel next to its button, for a few details or a couple of settings. It is not modal: focus moves into it, and Escape or a click outside closes it and puts focus back on the button. Screen readers name it after the button. For a task that needs the reader's full attention, use a dialog.

Docs: https://ghazal-ui.github.io/ghazal/components/popover

```tsx
import { Popover } from '@ghazal-ui/react';
```

When to use something else:

- A short label for an icon button: [Tooltip](https://ghazal-ui.github.io/ghazal/components/tooltip)
- A list of actions: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)
- A task that needs the reader’s full attention: [Dialog](https://ghazal-ui.github.io/ghazal/components/dialog)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `trigger` | `ReactElement` |  | Required. One pressable element, such as Button. |
| `children` | `ReactNode` |  | The content of the panel. |
| `placement` | `'bottom start' \| 'top start' \| …` | `'bottom start'` | Where it opens, if there is room. |

Keyboard and screen readers:

- Enter or Space: Open it from its button; focus moves in.
- Escape: Close it, and put focus back on the button.
- Named after its button. It is not modal, so the page stays reachable.

## Examples

### Details

```tsx
<Popover trigger={<Button variant="secondary">Delivery fee</Button>}>
  <p className="ui-popover__title">EGP 45 in Cairo and Giza</p>
  <p>Free on orders over EGP 500.</p>
</Popover>
```

### A few settings

```tsx
<Popover trigger={<Button variant="secondary">View options</Button>}>
  <Switch label="Show paid orders" />
  <Switch label="Compact rows" />
</Popover>
```
