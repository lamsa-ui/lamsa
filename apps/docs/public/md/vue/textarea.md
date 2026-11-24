# Textarea

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

The multi-line twin of the text field: the same label, hint and error, with room for a few lines. The reader can make it taller.

Docs: https://ghazal-ui.github.io/ghazal/components/textarea

```ts
import { Textarea } from '@ghazal-ui/vue';
// Bind it with v-model; every other attribute goes to the textarea: rows, maxlength.
```

When to use something else:

- One line of text: [Text field](https://ghazal-ui.github.io/ghazal/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label, tied to the textarea. |
| `hint` | `string` |  | Help text under the textarea, read with it. |
| `error` | `string` |  | The translated error. Marks the textarea invalid and announces the message. |
| `testId` | `string` |  | data-testid on the textarea, for tests. |

Keyboard and screen readers:

- The same label, hint and error as the text field, all read with it.

## Examples

### With a hint

```vue
<Textarea
  label="Delivery notes"
  hint="Gate code, floor, anything the driver should know."
  :rows="4"
  name="notes"
/>
```

### With an error

Same rules as the text field: the message is announced, and the border thickens, so colour is never the only sign.

```vue
<Textarea
  label="Reason for the refund"
  v-model="reason"
  :error="reason ? undefined : 'Tell us what went wrong'"
/>
```

### In Arabic

```vue
<!-- dir="rtl" on the page or any ancestor -->
<Textarea label="ملاحظات التوصيل" hint="كود البوابة، الدور، أي حاجة السواق محتاج يعرفها." />
```
