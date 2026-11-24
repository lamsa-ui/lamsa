# Radio group

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

One choice from a short list, with every option in view. Native radios: Tab reaches the group, arrow keys move the choice. For more than five or six options, use a select.

Docs: https://ghazal-ui.github.io/ghazal/components/radio-group

```ts
import { RadioGroup } from '@ghazal-ui/vue';
```

When to use something else:

- Several choices at once: [Checkbox](https://ghazal-ui.github.io/ghazal/components/checkbox)
- More than about 7 options: [Select](https://ghazal-ui.github.io/ghazal/components/select)
- Switch the view of the page: [Segmented control](https://ghazal-ui.github.io/ghazal/components/segmented-control)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the group. |
| `options` | `RadioOption<T>[]` |  | Required. { value, label, disabled? } for each radio. |
| `v-model` | `string` |  | The chosen value. |
| `@change` | `event` |  | The native change event; v-model already holds the new choice. |
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

```vue
<RadioGroup
  label="Delivery"
  hint="Same day is not available for this address."
  :options="speeds"
  v-model="speed"
/>
```

### Side by side, with an error

Short answers can sit on one line. An error adds a red edge and the message, which is announced.

```vue
<RadioGroup
  label="Do you have a parking space?"
  orientation="horizontal"
  :options="[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]"
  v-model="parking"
  :error="parking ? undefined : 'Choose yes or no'"
/>
```

### In Arabic

```vue
<RadioGroup label="التوصيل" :options="speeds" v-model="speed" />
```
