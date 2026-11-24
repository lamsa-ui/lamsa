# Radio group

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

One choice from a short list, with every option in view. Native radios: Tab reaches the group, arrow keys move the choice. For more than five or six options, use a select.

Docs: https://lamsa-ui.github.io/lamsa/components/radio-group

```tsx
import { RadioGroup } from '@lamsa-ui/react';
```

When to use something else:

- Several choices at once: [Checkbox](https://lamsa-ui.github.io/lamsa/components/checkbox)
- More than about 7 options: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Switch the view of the page: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the group. |
| `options` | `RadioOption<T>[]` |  | Required. { value, label, disabled? } for each radio. |
| `value, defaultValue` | `T` |  | The chosen value, controlled or not. |
| `onChange` | `(value: T) => void` |  | Called with the new choice. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Side by side for two or three short answers. |
| `hint, error` | `string` |  | As for the text field. |
| `disabled` | `boolean` |  | Disables every radio. |
| `name` | `string` |  | Form field name; made up when left out. |
| `testId` | `string` |  | data-testid prefix; each radio gets -<index>. |

Keyboard and screen readers:

- Tab: Reach the group, on the chosen option.
- Arrow keys: Move the choice to the next or previous option.
- Native radios in a named group, so the group name is read first.

## Examples

### One per line

```tsx
<RadioGroup
  label="Delivery"
  hint="Same day is not available for this address."
  options={speeds}
  value={speed}
  onChange={setSpeed}
/>
```

### Side by side, with an error

Short answers can sit on one line. An error adds a red edge and the message, which is announced.

```tsx
<RadioGroup
  label="Do you have a parking space?"
  orientation="horizontal"
  options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
  value={parking}
  onChange={setParking}
  error={parking ? undefined : 'Choose yes or no'}
/>
```

### In Arabic

```tsx
<RadioGroup label="التوصيل" options={speeds} value={speed} onChange={setSpeed} />
```
