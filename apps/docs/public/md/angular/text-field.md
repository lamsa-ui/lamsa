# Text field

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Label, input, hint and error as one control. The label, hint and error are tied to the input, so screen readers read all three.

Docs: https://lamsa-ui.github.io/lamsa/components/text-field

```ts
import { TextFieldComponent } from '@lamsa-ui/angular';
// Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- Several lines of text: [Textarea](https://lamsa-ui.github.io/lamsa/components/textarea)
- A unit or currency beside the value: [Input group](https://lamsa-ui.github.io/lamsa/components/input-group)
- A number with − and + buttons: [Number field](https://lamsa-ui.github.io/lamsa/components/number-field)
- Search with a clear button: [Search field](https://lamsa-ui.github.io/lamsa/components/search-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label, tied to the input. |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url'` | `'text'` | The input type. |
| `hint` | `string` |  | Help text under the input, read with it. |
| `error` | `string` |  | The translated error. Marks the input invalid and announces the message. |
| `autocomplete` | `string` |  | The browser autofill hint, such as email or name. |
| `testId` | `string` |  | data-testid on the input, for tests. |

## Examples

### With a hint

```html
<ui-text-field
  label="Email"
  type="email"
  hint="We only use it for order updates."
  autocomplete="email"
  formControlName="email"
/>
```

### With an error

Pass the translated message. The input gets aria-invalid, a thicker border, and the message is announced. Colour is never the only sign.

```html
<ui-text-field
  label="Full name"
  formControlName="name"
  [error]="form.controls.name.invalid ? 'Enter your full name' : undefined"
/>
```

### Disabled

Disable it through the form control, as with any input.

```html
order = new FormControl({ value: 'ORD-1042', disabled: true });

<ui-text-field label="Order number" [formControl]="order" />
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<ui-text-field label="البريد الإلكتروني" type="email" hint="بنستخدمه لتحديثات الطلب بس." />
```
