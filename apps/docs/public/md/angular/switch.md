# Switch

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

An on or off setting that takes effect at once, with no save button. Screen readers say on and off, and the knob's side shows the state, so it never depends on colour. For a choice saved with a form, use a checkbox.

Docs: https://ghazal-ui.github.io/ghazal/components/switch

```ts
import { SwitchComponent } from '@ghazal-ui/angular';
// The value is true or false. Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- A choice sent with a form: [Checkbox](https://ghazal-ui.github.io/ghazal/components/checkbox)
- A pressed state in a toolbar, such as bold: [Toggle](https://ghazal-ui.github.io/ghazal/components/toggle)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The setting it turns on. |
| `hint` | `string` |  | Help text under it, read with the switch. |
| `testId` | `string` |  | data-testid on the input, for tests. |

Keyboard and screen readers:

- Space: Turn it on or off.
- A checkbox with the switch role, so screen readers say on and off.

## Examples

### Settings

```html
<ui-switch
  label="Order updates"
  hint="A message to your phone when the driver is near."
  formControlName="updates"
/>
<ui-switch label="Offers" formControlName="offers" />
```

### In Arabic

```html
<ui-switch label="تحديثات الطلب" formControlName="updates" />
```
