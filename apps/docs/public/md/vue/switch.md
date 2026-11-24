# Switch

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

An on or off setting that takes effect at once, with no save button. Screen readers say on and off, and the knob's side shows the state, so it never depends on colour. For a choice saved with a form, use a checkbox.

Docs: https://lamsa-ui.github.io/lamsa/components/switch

```ts
import { Switch } from '@lamsa-ui/vue';
// Bind it with v-model; every other attribute goes to the input: name, required.
```

When to use something else:

- A choice sent with a form: [Checkbox](https://lamsa-ui.github.io/lamsa/components/checkbox)
- A pressed state in a toolbar, such as bold: [Toggle](https://lamsa-ui.github.io/lamsa/components/toggle)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The setting it turns on. |
| `hint` | `string` |  | Help text under it, read with the switch. |
| `testId` | `string` |  | data-testid on the input. |

## Examples

### Settings

```vue
<Switch
  label="Order updates"
  hint="A message to your phone when the driver is near."
  :checked="updates"
  @change="(e) => save({{ updates: e.target.checked }})"
/>
```

### In Arabic

```vue
<Switch label="تحديثات الطلب" :checked="updates" @change="toggle" />
```
