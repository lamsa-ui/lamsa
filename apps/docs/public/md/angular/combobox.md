# Combobox

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A text field that filters a list as you type, for a long list such as countries. Focus stays in the field: arrow keys move through the matches, Enter picks one and Escape closes the list. The value is always one of the options.

Docs: https://lamsa-ui.github.io/lamsa/components/combobox

```ts
import { ComboboxComponent } from '@lamsa-ui/angular';
// Options are { value, label, disabled? }, as for ui-select. Add @angular/cdk/overlay-prebuilt.css.
```

When to use something else:

- One choice from fewer than about 10 options: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Several values: [Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)
- Find a page or run a command from anywhere: [Command palette](https://lamsa-ui.github.io/lamsa/components/command-palette)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the field and the list. |
| `options` | `SelectOption<T>[]` |  | Required. { value, label, disabled? }. The label is what is matched. |
| `placeholder` | `string` |  | Shown while the field is empty. |
| `hint, error` | `string` |  | As for the text field. |
| `emptyText` | `string` | `'No matches'` | Announced when nothing matches; pass the translated text. |
| `compareWith` | `(a: T, b: T) => boolean` | `===` | How to match the form value to an option, for object values. |
| `testId` | `string` |  | data-testid on the input; options get -option-<index>. |

Keyboard and screen readers:

- Up or Down: Open the list and move through the matches, wrapping round.
- Enter: Pick the highlighted match.
- Escape: Close the list.
- Focus stays in the field; the highlighted match is read as it moves.

## Examples

### Countries

```html
<ui-combobox
  label="Country"
  placeholder="Start typing"
  hint="Where the company is registered."
  [options]="countries"
  formControlName="country"
/>
```

### With an error

```html
<ui-combobox
  label="Country of birth"
  [options]="countries"
  formControlName="birth"
  [error]="form.controls.birth.invalid ? 'Choose a country' : undefined"
/>
```

### In Arabic

```html
<ui-combobox label="الدولة" emptyText="مفيش نتايج" [options]="countries" />
```
