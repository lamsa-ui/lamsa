# Button group

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Buttons that belong together, joined into one bar. The group has a name, so a screen reader says what the buttons are for before it reads them.

Docs: https://lamsa-ui.github.io/lamsa/components/button-group

```ts
import { Button, ButtonGroup } from '@lamsa-ui/vue';
```

When to use something else:

- One choice that changes the view: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)
- Many controls with arrow-key movement, as in an editor: [Toolbar](https://lamsa-ui.github.io/lamsa/components/toolbar)
- More actions than fit on a phone: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. What the buttons do together, for screen readers. |
| `#default` | `slot` |  | The buttons. |

## Examples

### Actions on one thing

Each button is still a normal button: Tab reaches every one.

```vue
<ButtonGroup label="Invoice">
  <Button variant="secondary">Download</Button>
  <Button variant="secondary">Print</Button>
  <Button variant="secondary">Email</Button>
</ButtonGroup>
```

### In Arabic

```vue
<ButtonGroup label="الفاتورة">
  <Button variant="secondary">تنزيل</Button>
  <Button variant="secondary">طباعة</Button>
</ButtonGroup>
```
