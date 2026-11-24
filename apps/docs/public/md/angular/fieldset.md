# Fieldset

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A titled group of fields inside a longer form. Screen readers read the legend as they enter the group, so a field called Street is heard as part of the delivery address.

Docs: https://lamsa-ui.github.io/lamsa/components/fieldset

```ts
import { FieldsetComponent } from '@lamsa-ui/angular';
// An attribute on a native fieldset: <fieldset ui-fieldset legend="…">
```

When to use something else:

- A frame around content that is not a form: [Card](https://lamsa-ui.github.io/lamsa/components/card)
- One choice from a few, with a group label: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `legend` | `string` |  | Required. The group title. |
| `hint` | `string` |  | A line under the legend, read with the group. |
| `disabled` | `boolean` |  | The native attribute: disables every field inside. |

## Examples

### An address

```html
<fieldset ui-fieldset legend="Delivery address" hint="Where the driver should go.">
  <ui-text-field label="Street" autocomplete="address-line1" formControlName="street" />
  <ui-text-field label="City" autocomplete="address-level2" formControlName="city" />
</fieldset>
```

### In Arabic

```html
<fieldset ui-fieldset legend="عنوان التوصيل">…</fieldset>
```
