# Textarea

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The multi-line twin of the text field: the same label, hint and error, with room for a few lines. The reader can make it taller.

Docs: https://lamsa-ui.github.io/lamsa/components/textarea

```tsx
import { Textarea } from '@lamsa-ui/react';
// Every other prop goes to the textarea: value, onChange, rows, maxLength, ref.
```

When to use something else:

- One line of text: [Text field](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label, tied to the textarea. |
| `hint` | `string` |  | Help text under the textarea, read with it. |
| `error` | `string` |  | The translated error. Marks the textarea invalid and announces the message. |
| `testId` | `string` |  | data-testid on the textarea, for tests. |
| `...props` | `textarea props` | `rows: 3` | Every native textarea prop: value, onChange, rows, maxLength, name, ref. |

## Examples

### With a hint

```tsx
<Textarea
  label="Delivery notes"
  hint="Gate code, floor, anything the driver should know."
  rows={4}
  name="notes"
/>
```

### With an error

Same rules as the text field: the message is announced, and the border thickens, so colour is never the only sign.

```tsx
<Textarea
  label="Reason for the refund"
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  error={reason ? undefined : 'Tell us what went wrong'}
/>
```

### In Arabic

```tsx
{/* dir="rtl" on the page or any ancestor */}
<Textarea label="ملاحظات التوصيل" hint="كود البوابة، الدور، أي حاجة السواق محتاج يعرفها." />
```
