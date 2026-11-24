# Textarea

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The multi-line twin of the text field: the same label, hint and error, with room for a few lines. The reader can make it taller.

Docs: https://lamsa-ui.github.io/lamsa/components/textarea

```ts
import { TextareaComponent } from '@lamsa-ui/angular';
// Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- One line of text: [Text field](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label, tied to the textarea. |
| `rows` | `number` | `3` | Height in lines. The reader can still make it taller. |
| `maxlength` | `number` |  | The most characters it accepts. |
| `hint` | `string` |  | Help text under the textarea, read with it. |
| `error` | `string` |  | The translated error. Marks the textarea invalid and announces the message. |
| `testId` | `string` |  | data-testid on the textarea, for tests. |

Keyboard and screen readers:

- The same label, hint and error as the text field, all read with it.

## Examples

### With a hint

```html
<ui-textarea
  label="Delivery notes"
  hint="Gate code, floor, anything the driver should know."
  [rows]="4"
  formControlName="notes"
/>
```

### With an error

Same rules as the text field: the message is announced, and the border thickens, so colour is never the only sign.

```html
<ui-textarea
  label="Reason for the refund"
  formControlName="reason"
  [error]="form.controls.reason.invalid ? 'Tell us what went wrong' : undefined"
/>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<ui-textarea label="ملاحظات التوصيل" hint="كود البوابة، الدور، أي حاجة السواق محتاج يعرفها." />
```
