# File field

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The browser's own file input, with a label, hint and error, in a zone that also takes files dropped on it. The native button and file names stay, so it works with the keyboard, screen readers and phone cameras as usual.

Docs: https://lamsa-ui.github.io/lamsa/components/file-field

```ts
import { FileFieldComponent } from '@lamsa-ui/angular';
// The value is a File[]. Writing null or [] to the control clears the input.
```

When to use something else:

- Typed text or a link to a file: [Text field](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label, tied to the input. |
| `accept` | `string` |  | File types the picker offers: '.pdf', 'image/*'. |
| `multiple` | `boolean` | `false` | Allows more than one file. |
| `hint, error` | `string` |  | As for the text field. |
| `dropText` | `string` | `'Or drop a file here'` | The line under the button; pass the translated text. |
| `testId` | `string` |  | data-testid on the input, for tests. |

Keyboard and screen readers:

- Enter or Space: Open the file chooser.
- The browser’s own file input: the button and the chosen file names are read as usual.
- Dropping files is a shortcut; the button always works.

## Examples

### One file

accept limits what the picker offers. It cannot stop a drop, so check the type and size again on the server.

```html
<ui-file-field label="Invoice" accept=".pdf" hint="PDF, up to 5 MB." formControlName="invoice" />
```

### Several files, with an error

```html
<ui-file-field
  label="Photos of the damage"
  accept="image/*"
  multiple
  dropText="Or drop photos here"
  formControlName="photos"
  [error]="form.controls.photos.invalid ? 'Add at least one photo' : undefined"
/>
```

### In Arabic

```html
<ui-file-field label="الفاتورة" dropText="أو اسحب الملف هنا" formControlName="invoice" />
```
