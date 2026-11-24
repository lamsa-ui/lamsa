# Switch

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

An on or off setting that takes effect at once, with no save button. Screen readers say on and off, and the knob's side shows the state, so it never depends on colour. For a choice saved with a form, use a checkbox.

Docs: https://lamsa-ui.github.io/lamsa/components/switch

```tsx
import { Switch } from '@lamsa-ui/react';
// Every other prop goes to the input: checked, onChange, name, ref.
```

When to use something else:

- A choice sent with a form: [Checkbox](https://lamsa-ui.github.io/lamsa/components/checkbox)
- A pressed state in a toolbar, such as bold: [Toggle](https://lamsa-ui.github.io/lamsa/components/toggle)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The setting it turns on. |
| `hint` | `string` |  | Help text under it, read with the switch. |
| `testId` | `string` |  | data-testid on the input. |
| `...props` | `input props` |  | Every native input prop: checked, defaultChecked, onChange, disabled, ref. |

## Examples

### Settings

```tsx
<Switch
  label="Order updates"
  hint="A message to your phone when the driver is near."
  checked={updates}
  onChange={(e) => save({ updates: e.target.checked })}
/>
```

### In Arabic

```tsx
<Switch label="تحديثات الطلب" checked={updates} onChange={toggle} />
```
