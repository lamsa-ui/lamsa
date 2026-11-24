# Number field

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A number with − and + either side. Type it, in Latin or Arabic digits, or step it with the buttons, the arrow keys, or Page Up and Down for ten steps. On leaving the field it stays inside its limits and is written in the reader's language.

Docs: https://lamsa-ui.github.io/lamsa/components/number-field

```ts
import { NumberField } from '@lamsa-ui/vue';
```

When to use something else:

- A rough amount on a scale: [Slider](https://lamsa-ui.github.io/lamsa/components/slider)
- A code such as an ID or a card number: [Text field](https://lamsa-ui.github.io/lamsa/components/text-field)
- A price with a currency beside it: [Input group](https://lamsa-ui.github.io/lamsa/components/input-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the field. |
| `min \| max` | `number` |  | Limits. Stepping stops at them; typing is pulled back on leaving. |
| `step` | `number` | `1` | One press. Page Up and Down move ten. |
| `formatOptions` | `Intl.NumberFormatOptions` |  | Currency, units or decimals. With percent the value is the fraction, so step 0.01. |
| `hint \| error` | `string` |  | Help text, and the translated error that marks it invalid. |
| `decrementLabel \| incrementLabel` | `string` | `Decrease \| Increase` | Names the buttons. Translate them. |
| `v-model` | `number \| null` |  | The number, or null when the field is empty. |

## Examples

### A quantity

The number is the one Tab stop; the buttons are for the pointer, as Up and Down do the same.

```vue
<NumberField label="Guests" :min="1" :max="12" hint="Up to 12 at one table." v-model="guests" />
```

### Money

formatOptions takes any Intl number format: currency, units, or a fixed number of decimals.

```vue
<NumberField
  label="Budget"
  :min="0"
  :step="50"
  :formatOptions="{ style: 'currency', currency: 'EGP' }"
  v-model="budget"
/>
```

### In Arabic

```vue
<I18nProvider locale="ar-EG">
  <NumberField label="عدد الضيوف" :min="1" :max="12" />
</I18nProvider>
```
