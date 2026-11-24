# Checkbox

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A yes or no that is saved with the form, such as accepting the terms. The native checkbox in the primary colour; the whole label is the hit area, at least 44px tall.

Docs: https://lamsa-ui.github.io/lamsa/components/checkbox

```ts
import { CheckboxComponent } from '@lamsa-ui/angular';
// The value is true or false. Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- One choice from a few options: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)
- A setting that takes effect at once: [Switch](https://lamsa-ui.github.io/lamsa/components/switch)
- Several choices from a long list: [Combobox or Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label; the whole label is the hit area. |
| `hint` | `string` |  | Help text under the checkbox, read with it. |
| `error` | `string` |  | The translated error. Marks the checkbox invalid and announces the message. |
| `indeterminate` | `boolean` | `false` | Shows a dash: some of the items under it are ticked. |
| `testId` | `string` |  | data-testid on the input, for tests. |

## Examples

### With a hint

```html
<ui-checkbox
  label="Email me about my orders"
  hint="One email per order, no adverts."
  formControlName="updates"
/>
```

### With an error

The message is announced and tied to the checkbox, so a screen reader hears why the form did not send.

```html
<ui-checkbox
  label="I accept the terms"
  formControlName="terms"
  [error]="form.controls.terms.invalid ? 'Accept the terms to continue' : undefined"
/>
```

### Some of a list

indeterminate shows a dash on a parent checkbox when only some items under it are ticked.

```html
<ui-checkbox label="All files" [indeterminate]="some()" formControlName="all" />
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<ui-checkbox label="ابعتلي إيميل عن طلباتي" />
```
