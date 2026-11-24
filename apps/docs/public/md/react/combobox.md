# Combobox

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A text field that filters a list as you type, for a long list such as countries. Focus stays in the field: arrow keys move through the matches, Enter picks one and Escape closes the list. The value is always one of the options.

Docs: https://lamsa-ui.github.io/lamsa/components/combobox

```tsx
import { Combobox } from '@lamsa-ui/react';
```

When to use something else:

- One choice from fewer than about 10 options: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Several values: [Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)
- Find a page or run a command from anywhere: [Command palette](https://lamsa-ui.github.io/lamsa/components/command-palette)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the field and the list. |
| `options` | `SelectOption<T>[]` |  | Required. { value, label, disabled? }. |
| `value, defaultValue` | `T \| null` |  | The chosen value, controlled or not. |
| `onChange` | `(value: T \| null) => void` |  | Called with the picked value, or null when the field is emptied. |
| `placeholder, hint, error` | `string` |  | As for the text field. |
| `emptyText` | `string` | `'No matches'` | Announced when nothing matches. |
| `disabled` | `boolean` |  | Disables the field. |
| `name` | `string` |  | Sends the value with a native form. |
| `testId` | `string` |  | data-testid on the input; options get -option-<index>. |

## Examples

### Countries

```tsx
<Combobox
  label="Country"
  placeholder="Start typing"
  hint="Where the company is registered."
  options={countries}
  value={country}
  onChange={setCountry}
/>
```

### With an error

```tsx
<Combobox
  label="Country of birth"
  options={countries}
  value={birth}
  onChange={setBirth}
  error={birth ? undefined : 'Choose a country'}
/>
```

### In Arabic

```tsx
<Combobox label="الدولة" emptyText="مفيش نتايج" options={countries} />
```
