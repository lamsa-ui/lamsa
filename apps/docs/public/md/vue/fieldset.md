# Fieldset

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A titled group of fields inside a longer form. Screen readers read the legend as they enter the group, so a field called Street is heard as part of the delivery address.

Docs: https://ghazal-ui.github.io/ghazal/components/fieldset

```ts
import { Fieldset } from '@ghazal-ui/vue';
```

When to use something else:

- A frame around content that is not a form: [Card](https://ghazal-ui.github.io/ghazal/components/card)
- One choice from a few, with a group label: [Radio group](https://ghazal-ui.github.io/ghazal/components/radio-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `legend` | `string` |  | Required. The group title. |
| `hint` | `string` |  | A line under the legend, read with the group. |

Keyboard and screen readers:

- The legend is read when focus enters the group, so each field is heard as part of it.

## Examples

### An address

```vue
<Fieldset legend="Delivery address" hint="Where the driver should go.">
  <TextField label="Street" autoComplete="address-line1" />
  <TextField label="City" autoComplete="address-level2" />
</Fieldset>
```

### In Arabic

```vue
<Fieldset legend="عنوان التوصيل">…</Fieldset>
```
