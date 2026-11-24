# Checkbox

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A yes or no that is saved with the form, such as accepting the terms. The native checkbox in the primary colour; the whole label is the hit area, at least 44px tall.

Docs: https://lamsa-ui.github.io/lamsa/components/checkbox

```ts
import { Checkbox } from '@lamsa-ui/vue';
// Bind it with v-model; every other attribute goes to the input: name, required.
```

When to use something else:

- One choice from a few options: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)
- A setting that takes effect at once: [Switch](https://lamsa-ui.github.io/lamsa/components/switch)
- Several choices from a long list: [Combobox or Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label. |
| `hint` | `string` |  | Help text, read with the checkbox. |
| `error` | `string` |  | The translated error. Marks it invalid and announces the message. |
| `indeterminate` | `boolean` | `false` | Shows a dash: some of the items under it are ticked. |
| `testId` | `string` |  | data-testid on the input. |

## Examples

### With a hint

```vue
<Checkbox
  label="Email me about my orders"
  hint="One email per order, no adverts."
  v-model="updates"
/>
```

### With an error

The message is announced and tied to the checkbox, so a screen reader hears why the form did not send.

```vue
<Checkbox
  label="I accept the terms"
  v-model="terms"
  :error="terms ? undefined : 'Accept the terms to continue'"
/>
```

### Some of a list

indeterminate shows a dash on a parent checkbox when only some items under it are ticked.

```vue
<Checkbox label="All files" :indeterminate="some" :checked="all" @change="toggleAll" />
```

### In Arabic

```vue
<!-- dir="rtl" on the page or any ancestor -->
<Checkbox label="ابعتلي إيميل عن طلباتي" />
```
