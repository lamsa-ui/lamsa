# Chip input

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A text field that collects several short values, such as toppings, email addresses or skills. Each value becomes a tag with its own named remove button. Screen readers hear each value being added and removed, and focus never falls off the field.

Docs: https://ghazal-ui.github.io/ghazal/components/chip-input

```ts
import { ChipInputComponent } from '@ghazal-ui/angular';
// The value is a string[]. Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- One value from a known list: [Combobox](https://ghazal-ui.github.io/ghazal/components/combobox)
- A few choices that fit on screen: [Checkbox](https://ghazal-ui.github.io/ghazal/components/checkbox)
- Show labels the user cannot type: [Tag](https://ghazal-ui.github.io/ghazal/components/tag)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the field and the list of tags. |
| `hint \| placeholder` | `string` |  | Help under the field; text in the empty field. |
| `removeLabel` | `string` | `'Remove' from labels` | First word of each × button's name. Translate it. |
| `addedLabel \| removedLabel` | `(chip: string) => string` | ``${c} added` from labels` | What screen readers hear after a change. Translate them. |

Keyboard and screen readers:

- Enter or ,: Add what is typed as a tag.
- Backspace: In an empty field, move to the last tag’s remove button.
- Enter or Space: On a remove button, remove that tag.
- Each tag has its own remove button, named after its value.
- Adding and removing are announced, and focus moves to the next tag or back to the field.

## Examples

### Toppings

Type, then Enter or a comma. Backspace in the empty field moves to the last tag; Enter on its × removes it and moves focus to the next.

```html
<ui-chip-input
  label="Toppings"
  hint="Press Enter after each one."
  formControlName="toppings"
/>
```

### In Arabic

```html
<ui-chip-input label="الإضافات" removeLabel="إزالة"
  [addedLabel]="added" [removedLabel]="removed" formControlName="toppings" />

added = (c: string) => `تمت إضافة ${c}`;
removed = (c: string) => `تمت إزالة ${c}`;
```
