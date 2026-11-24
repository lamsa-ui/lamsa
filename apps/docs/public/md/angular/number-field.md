# Number field

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A number with − and + either side. Type it, in Latin or Arabic digits, or step it with the buttons, the arrow keys, or Page Up and Down for ten steps. On leaving the field it stays inside its limits and is written in the reader's language.

Docs: https://lamsa-ui.github.io/lamsa/components/number-field

```ts
import { NumberFieldComponent } from '@lamsa-ui/angular';
// The value is a number, or null when empty.
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
| `locale` | `string` | `LOCALE_ID` | Digits and separators: ar-EG writes Arabic digits. |

## Examples

### A quantity

The number is the one Tab stop; the buttons are for the pointer, as Up and Down do the same.

```html
<ui-number-field label="Guests" [min]="1" [max]="12" hint="Up to 12 at one table." formControlName="guests" />
```

### Money

formatOptions takes any Intl number format: currency, units, or a fixed number of decimals.

```html
<ui-number-field
  label="Budget"
  [min]="0"
  [step]="50"
  [formatOptions]="{ style: 'currency', currency: 'EGP' }"
  formControlName="budget"
/>
```

### In Arabic

```html
<ui-number-field label="عدد الضيوف" locale="ar-EG" decrementLabel="إنقاص" incrementLabel="زيادة" [min]="1" [max]="12" />
```
