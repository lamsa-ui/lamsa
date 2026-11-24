# Switch

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

An on or off setting that takes effect at once, with no save button. Screen readers say on and off, and the knob's side shows the state, so it never depends on colour. For a choice saved with a form, use a checkbox.

Docs: https://ghazal-ui.github.io/ghazal/components/switch

```ts
import { Switch } from '@ghazal-ui/vue';
// Bind it with v-model; every other attribute goes to the input: name, required.
```

When to use something else:

- A choice sent with a form: [Checkbox](https://ghazal-ui.github.io/ghazal/components/checkbox)
- A pressed state in a toolbar, such as bold: [Toggle](https://ghazal-ui.github.io/ghazal/components/toggle)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The setting it turns on. |
| `hint` | `string` |  | Help text under it, read with the switch. |
| `testId` | `string` |  | data-testid on the input. |

Keyboard and screen readers:

- Space: Turn it on or off.
- A checkbox with the switch role, so screen readers say on and off.

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
