# Text field

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Label, input, hint and error as one control. The label, hint and error are tied to the input, so screen readers read all three.

Docs: https://ghazal-ui.github.io/ghazal/components/text-field

```ts
import { TextField } from '@ghazal-ui/vue';
// Bind it with v-model; every other attribute goes to the input:
// name, autocomplete, required, maxlength.
```

When to use something else:

- Several lines of text: [Textarea](https://ghazal-ui.github.io/ghazal/components/textarea)
- A unit or currency beside the value: [Input group](https://ghazal-ui.github.io/ghazal/components/input-group)
- A number with − and + buttons: [Number field](https://ghazal-ui.github.io/ghazal/components/number-field)
- Search with a clear button: [Search field](https://ghazal-ui.github.io/ghazal/components/search-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label, tied to the input. |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url'` | `'text'` | The input type. |
| `hint` | `string` |  | Help text under the input, read with it. |
| `error` | `string` |  | The translated error. Marks the input invalid and announces the message. |
| `testId` | `string` |  | data-testid on the input, for tests. |

Keyboard and screen readers:

- The label, hint and error are tied to the input, so all three are read.
- An error is announced when it appears.

## Examples

### With a hint

```vue
<TextField
  label="Email"
  type="email"
  hint="We only use it for order updates."
  autoComplete="email"
  name="email"
/>
```

### With an error

Pass the translated message. The input gets aria-invalid, a thicker border, and the message is announced. Colour is never the only sign.

```vue
<script setup lang="ts">
import { ref } from 'vue';
const name = ref('');
</script>

<template>
  <TextField
    v-model="name"
    label="Full name"
    :error="name ? undefined : 'Enter your full name'"
  />
</template>
```

### Disabled

Disable it through the form control, as with any input.

```vue
<TextField label="Order number" model-value="ORD-1042" disabled />
```

### In Arabic

```vue
<!-- dir="rtl" on the page or any ancestor -->
<TextField label="البريد الإلكتروني" type="email" hint="بنستخدمه لتحديثات الطلب بس." />
```
