# Select

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

One choice from a list. Arrow keys, Home and End, and typing the first letters all move through the options; Escape and Tab close the list and return focus.

Docs: https://lamsa-ui.github.io/lamsa/components/select

```ts
import { SelectComponent, type SelectOption } from '@lamsa-ui/angular';
// Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- A long list the reader searches: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)
- Two to five options that fit on screen: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)
- Actions, not values: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label; it names the button and the list. |
| `options` | `SelectOption<T>[]` |  | Required. { value, label, disabled? } for each option. |
| `placeholder` | `string` | `''` | Shown while nothing is chosen. |
| `error` | `string` |  | The translated error. Marks the select invalid and announces the message. |
| `compareWith` | `(a: T, b: T) => boolean` | `===` | How to match the form value to an option, for object values. |
| `testId` | `string` |  | data-testid on the button; options get -option-<index>. |

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
