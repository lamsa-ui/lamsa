# Button group

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Buttons that belong together, joined into one bar. The group has a name, so a screen reader says what the buttons are for before it reads them.

Docs: https://ghazal-ui.github.io/ghazal/components/button-group

```tsx
import { Button, ButtonGroup } from '@ghazal-ui/react';
```

When to use something else:

- One choice that changes the view: [Segmented control](https://ghazal-ui.github.io/ghazal/components/segmented-control)
- Many controls with arrow-key movement, as in an editor: [Toolbar](https://ghazal-ui.github.io/ghazal/components/toolbar)
- More actions than fit on a phone: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. What the buttons do together, for screen readers. |
| `...props` | `div props` |  | Every native div prop. |

Keyboard and screen readers:

- Tab: Move from button to button.
- A named group, read before its buttons.

## Examples

### Actions on one thing

Each button is still a normal button: Tab reaches every one.

```tsx
<ButtonGroup label="Invoice">
  <Button variant="secondary">Download</Button>
  <Button variant="secondary">Print</Button>
  <Button variant="secondary">Email</Button>
</ButtonGroup>
```

### In Arabic

```tsx
<ButtonGroup label="الفاتورة">
  <Button variant="secondary">تنزيل</Button>
  <Button variant="secondary">طباعة</Button>
</ButtonGroup>
```
