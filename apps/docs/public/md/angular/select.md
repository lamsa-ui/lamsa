# Select

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

One choice from a list. Arrow keys, Home and End, and typing the first letters all move through the options; Escape and Tab close the list and return focus.

Docs: https://ghazal-ui.github.io/ghazal/components/select

```ts
import { SelectComponent, type SelectOption } from '@ghazal-ui/angular';
// Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- A long list the reader searches: [Combobox](https://ghazal-ui.github.io/ghazal/components/combobox)
- Two to five options that fit on screen: [Radio group](https://ghazal-ui.github.io/ghazal/components/radio-group)
- Actions, not values: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label; it names the button and the list. |
| `options` | `SelectOption<T>[]` |  | Required. { value, label, disabled? } for each option. |
| `placeholder` | `string` | `''` | Shown while nothing is chosen. |
| `error` | `string` |  | The translated error. Marks the select invalid and announces the message. |
| `compareWith` | `(a: T, b: T) => boolean` | `===` | How to match the form value to an option, for object values. |
| `testId` | `string` |  | data-testid on the button; options get -option-<index>. |

Keyboard and screen readers:

- Enter or Space or Up or Down: Open the list.
- Up or Down or Home or End: Move through the options.
- Letters: Jump to the option that starts with them.
- Enter or Space: Pick the option.
- Escape or Tab: Close the list, and put focus back on the button.
- Read as a list box, with the chosen option and the field’s label.

## Examples

### Basic

```html
cities: SelectOption<string>[] = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
];

<ui-select label="City" placeholder="Choose a city" [options]="cities" formControlName="city" />
```

### With an error

```html
sizes: SelectOption<string>[] = [
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large', disabled: true },
];

<ui-select label="Size" [options]="sizes" formControlName="size" error="Choose a size" />
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<ui-select label="المدينة" placeholder="اختار المدينة" [options]="cities" formControlName="city" />
```
