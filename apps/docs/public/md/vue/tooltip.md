# Tooltip

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short label for a control, shown on hover and on keyboard focus and read by screen readers as its description. The pointer can move onto it and Escape hides it. Touch screens never show tooltips, so never put anything needed in one.

Docs: https://lamsa-ui.github.io/lamsa/components/tooltip

```ts
import { Tooltip } from '@lamsa-ui/vue';
```

When to use something else:

- Content with links or buttons: [Popover](https://lamsa-ui.github.io/lamsa/components/popover)
- Help the reader needs to fill a field: [The field’s hint](https://lamsa-ui.github.io/lamsa/components/text-field)
- Show a keyboard shortcut: [Keyboard key inside the tooltip](https://lamsa-ui.github.io/lamsa/components/kbd)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `text` | `string` |  | Required. The short label. |
| `default slot` | `slot` |  | One focusable element, such as Button. |
| `placement` | `'top' \| 'bottom' \| 'start' \| 'end'` | `'top'` | Where it shows, if there is room. |

Keyboard and screen readers:

- Tab: Focus the control, and its tooltip shows.
- Escape: Hide the tooltip.
- Read as the control’s description; the pointer can move onto it.
- Touch screens never show tooltips, so nothing needed may live only in one.

## Examples

### On icon buttons

The button still needs its own name; the tooltip shows that name to sighted users.

```vue
<Tooltip text="Copy link">
  <Button variant="ghost" aria-label="Copy link"><Icon name="copy" /></Button>
</Tooltip>
```

### In Arabic

```vue
<Tooltip text="بيبعت الفاتورة لإيميل العميل"><Button variant="secondary">ابعت الفاتورة</Button></Tooltip>
```
