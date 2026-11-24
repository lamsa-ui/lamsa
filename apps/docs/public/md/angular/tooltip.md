# Tooltip

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short label for a control, shown on hover and on keyboard focus and read by screen readers as its description. The pointer can move onto it and Escape hides it. Touch screens never show tooltips, so never put anything needed in one.

Docs: https://lamsa-ui.github.io/lamsa/components/tooltip

```ts
import { TooltipDirective } from '@lamsa-ui/angular';
// On the Angular CDK overlay. Add @angular/cdk/overlay-prebuilt.css.
```

When to use something else:

- Content with links or buttons: [Popover](https://lamsa-ui.github.io/lamsa/components/popover)
- Help the reader needs to fill a field: [The field’s hint](https://lamsa-ui.github.io/lamsa/components/text-field)
- Show a keyboard shortcut: [Keyboard key inside the tooltip](https://lamsa-ui.github.io/lamsa/components/kbd)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `uiTooltip` | `string` |  | Required. The short label, on any focusable element. |

Keyboard and screen readers:

- Tab: Focus the control, and its tooltip shows.
- Escape: Hide the tooltip.
- Read as the control’s description; the pointer can move onto it.
- Touch screens never show tooltips, so nothing needed may live only in one.

## Examples

### On icon buttons

The button still needs its own name; the tooltip shows that name to sighted users.

```html
<button ui-button variant="ghost" aria-label="Copy link" uiTooltip="Copy link">
  <ui-icon name="copy" />
</button>
<button ui-button variant="secondary" uiTooltip="Sends the invoice to the customer's email">
  Send invoice
</button>
```

### In Arabic

```html
<button ui-button variant="secondary" uiTooltip="بيبعت الفاتورة لإيميل العميل">ابعت الفاتورة</button>
```
