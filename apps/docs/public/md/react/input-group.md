# Input group

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A text field with fixed text inside its box, before or after the value: a currency, a unit, a domain. The text is read with the field, so 'Price, EGP' is heard, but it is never part of the value.

Docs: https://lamsa-ui.github.io/lamsa/components/input-group

```tsx
import { TextField } from '@lamsa-ui/react';
```

When to use something else:

- A number with − and + buttons: [Number field](https://lamsa-ui.github.io/lamsa/components/number-field)
- A phone number with its country code: [Phone field](https://lamsa-ui.github.io/lamsa/components/phone-field)
- A search box with a clear button: [Search field](https://lamsa-ui.github.io/lamsa/components/search-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `prefix` | `string` |  | Text before the value, such as "EGP". Read after the label. |
| `suffix` | `string` |  | Text after the value, such as "kg" or ".com". |
| `label` | `string` |  | Required. Every other Text field option works too: see Text field. |

Keyboard and screen readers:

- The text before or after the value is read with the field, such as Price, EGP, but is never part of the value.

## Examples

### Before and after

Set prefix or suffix on a text field.

```tsx
<TextField label="Price" type="number" prefix="EGP" />
<TextField label="Weight" type="number" suffix="kg" />
<TextField label="Shop address" prefix="https://" suffix=".lamsa.shop" />
```

### In Arabic

```tsx
<TextField label="السعر" type="number" suffix="جنيه" />
```
