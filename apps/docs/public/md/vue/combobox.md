# Combobox

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A text field that filters a list as you type, for a long list such as countries. Focus stays in the field: arrow keys move through the matches, Enter picks one and Escape closes the list. The value is always one of the options.

Docs: https://ghazal-ui.github.io/ghazal/components/combobox

```ts
import { Combobox } from '@ghazal-ui/vue';
```

When to use something else:

- One choice from fewer than about 10 options: [Select](https://ghazal-ui.github.io/ghazal/components/select)
- Several values: [Chip input](https://ghazal-ui.github.io/ghazal/components/chip-input)
- Find a page or run a command from anywhere: [Command palette](https://ghazal-ui.github.io/ghazal/components/command-palette)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the field and the list. |
| `options` | `SelectOption<T>[]` |  | Required. { value, label, disabled? }. |
| `v-model` | `T \| null` |  | The chosen value, controlled or not. |
| `placeholder, hint, error` | `string` |  | As for the text field. |
| `emptyText` | `string` | `'No matches' from labels` | Announced when nothing matches. |
| `disabled` | `boolean` |  | Disables the field. |
| `name` | `string` |  | Sends the value with a native form. |
| `testId` | `string` |  | data-testid on the input; options get -option-<index>. |

Keyboard and screen readers:

- Up or Down: Open the list and move through the matches, wrapping round.
- Enter: Pick the highlighted match.
- Escape: Close the list.
- Focus stays in the field; the highlighted match is read as it moves.

## Examples

### Countries

```vue
<Combobox
  label="Country"
  placeholder="Start typing"
  hint="Where the company is registered."
  :options="countries"
  v-model="country"
/>
```

### With an error

```vue
<Combobox
  label="Country of birth"
  :options="countries"
  v-model="birth"
  :error="birth ? undefined : 'Choose a country'"
/>
```

### In Arabic

```vue
<Combobox label="الدولة" emptyText="مفيش نتايج" :options="countries" />
```
