# Button group

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Buttons that belong together, joined into one bar. The group has a name, so a screen reader says what the buttons are for before it reads them.

Docs: https://ghazal-ui.github.io/ghazal/components/button-group

```ts
import { ButtonComponent, ButtonGroupComponent } from '@ghazal-ui/angular';
```

When to use something else:

- One choice that changes the view: [Segmented control](https://ghazal-ui.github.io/ghazal/components/segmented-control)
- Many controls with arrow-key movement, as in an editor: [Toolbar](https://ghazal-ui.github.io/ghazal/components/toolbar)
- More actions than fit on a phone: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. What the buttons do together, for screen readers. |

Keyboard and screen readers:

- Tab: Move from button to button.
- A named group, read before its buttons.

## Examples

### Actions on one thing

Each button is still a normal button: Tab reaches every one.

```html
<ui-button-group label="Invoice">
  <button ui-button variant="secondary" type="button">Download</button>
  <button ui-button variant="secondary" type="button">Print</button>
  <button ui-button variant="secondary" type="button">Email</button>
</ui-button-group>
```

### In Arabic

```html
<ui-button-group label="الفاتورة">
  <button ui-button variant="secondary" type="button">تنزيل</button>
  <button ui-button variant="secondary" type="button">طباعة</button>
</ui-button-group>
```
