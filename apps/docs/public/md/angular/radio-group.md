# Radio group

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

One choice from a short list, with every option in view. Native radios: Tab reaches the group, arrow keys move the choice. For more than five or six options, use a select.

Docs: https://lamsa-ui.github.io/lamsa/components/radio-group

```ts
import { RadioGroupComponent } from '@lamsa-ui/angular';
// Options are { value, label, disabled? }, as for ui-select.
```

When to use something else:

- Several choices at once: [Checkbox](https://lamsa-ui.github.io/lamsa/components/checkbox)
- More than about 7 options: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Switch the view of the page: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the group. |
| `options` | `RadioOption<T>[]` |  | Required. { value, label, disabled? } for each radio. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Side by side for two or three short answers. |
| `hint` | `string` |  | Help text under the label, read with the group. |
| `error` | `string` |  | The translated error. Marks the group invalid and announces the message. |
| `compareWith` | `(a: T, b: T) => boolean` | `===` | How to match the form value to an option, for object values. |
| `testId` | `string` |  | data-testid prefix; each radio gets -<index>. |

Keyboard and screen readers:

- Tab: Reach the group, on the chosen option.
- Arrow keys: Move the choice to the next or previous option.
- Native radios in a named group, so the group name is read first.

## Examples

### One per line

```html
<ui-radio-group
  label="Delivery"
  hint="Same day is not available for this address."
  [options]="speeds"
  formControlName="speed"
/>
```

### Side by side, with an error

Short answers can sit on one line. An error adds a red edge and the message, which is announced.

```html
<ui-radio-group
  label="Do you have a parking space?"
  orientation="horizontal"
  [options]="yesNo"
  formControlName="parking"
  [error]="form.controls.parking.invalid ? 'Choose yes or no' : undefined"
/>
```

### In Arabic

```html
<ui-radio-group label="التوصيل" [options]="speeds" formControlName="speed" />
```
