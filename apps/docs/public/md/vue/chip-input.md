# Chip input

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A text field that collects several short values, such as toppings, email addresses or skills. Each value becomes a tag with its own named remove button. Screen readers hear each value being added and removed, and focus never falls off the field.

Docs: https://lamsa-ui.github.io/lamsa/components/chip-input

```ts
import { ChipInput } from '@lamsa-ui/vue';
```

When to use something else:

- One value from a known list: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)
- A few choices that fit on screen: [Checkbox](https://lamsa-ui.github.io/lamsa/components/checkbox)
- Show labels the user cannot type: [Tag](https://lamsa-ui.github.io/lamsa/components/tag)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the field and the list of tags. |
| `hint \| placeholder` | `string` |  | Help under the field; text in the empty field. |
| `removeLabel` | `string` | `'Remove'` | First word of each × button's name. Translate it. |
| `addedLabel \| removedLabel` | `(chip: string) => string` | ``${c} added`` | What screen readers hear after a change. Translate them. |
| `v-model` | `string[]` |  | The chips, in the order they were added. |
| `disabled` | `boolean` | `false` | Locks the field and hides the × buttons. |

## Examples

### Toppings

Type, then Enter or a comma. Backspace in the empty field moves to the last tag; Enter on its × removes it and moves focus to the next.

```vue
<ChipInput
  label="Toppings"
  hint="Press Enter after each one."
  v-model="toppings"
/>
```

### In Arabic

```vue
<ChipInput label="الإضافات" removeLabel="إزالة"
  :addedLabel="(c) => `تمت إضافة ${c}`"
  :removedLabel="(c) => `تمت إزالة ${c}`"
  v-model="toppings" />
```
