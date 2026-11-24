# Tooltip

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A short label for a control, shown on hover and on keyboard focus and read by screen readers as its description. The pointer can move onto it and Escape hides it. Touch screens never show tooltips, so never put anything needed in one.

Docs: https://ghazal-ui.github.io/ghazal/components/tooltip

```tsx
import { Tooltip } from '@ghazal-ui/react';
```

When to use something else:

- Content with links or buttons: [Popover](https://ghazal-ui.github.io/ghazal/components/popover)
- Help the reader needs to fill a field: [The field’s hint](https://ghazal-ui.github.io/ghazal/components/text-field)
- Show a keyboard shortcut: [Keyboard key inside the tooltip](https://ghazal-ui.github.io/ghazal/components/kbd)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `text` | `string` |  | Required. The short label. |
| `children` | `ReactElement` |  | One focusable element, such as Button. |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Where it shows, if there is room. |

Keyboard and screen readers:

- Tab: Focus the control, and its tooltip shows.
- Escape: Hide the tooltip.
- Read as the control’s description; the pointer can move onto it.
- Touch screens never show tooltips, so nothing needed may live only in one.

## Examples

### On icon buttons

The button still needs its own name; the tooltip shows that name to sighted users.

```tsx
<Tooltip text="Copy link">
  <Button variant="ghost" aria-label="Copy link"><Icon name="copy" /></Button>
</Tooltip>
```

### In Arabic

```tsx
<Tooltip text="بيبعت الفاتورة لإيميل العميل"><Button variant="secondary">ابعت الفاتورة</Button></Tooltip>
```
