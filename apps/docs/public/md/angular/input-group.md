# Input group

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A text field with fixed text inside its box, before or after the value: a currency, a unit, a domain. The text is read with the field, so 'Price, EGP' is heard, but it is never part of the value.

Docs: https://ghazal-ui.github.io/ghazal/components/input-group

```ts
import { TextFieldComponent } from '@ghazal-ui/angular';
```

When to use something else:

- A number with − and + buttons: [Number field](https://ghazal-ui.github.io/ghazal/components/number-field)
- A phone number with its country code: [Phone field](https://ghazal-ui.github.io/ghazal/components/phone-field)
- A search box with a clear button: [Search field](https://ghazal-ui.github.io/ghazal/components/search-field)

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

```html
<ui-text-field label="Price" type="number" prefix="EGP" />
<ui-text-field label="Weight" type="number" suffix="kg" />
<ui-text-field label="Shop address" prefix="https://" suffix=".ghazal.shop" />
```

### In Arabic

```html
<ui-text-field label="السعر" type="number" suffix="جنيه" />
```
