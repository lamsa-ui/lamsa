# Select

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

One choice from a list. Arrow keys, Home and End, and typing the first letters all move through the options; Escape and Tab close the list and return focus.

Docs: https://lamsa-ui.github.io/lamsa/components/select

```tsx
import { Select, type SelectOption } from '@lamsa-ui/react';
```

When to use something else:

- A long list the reader searches: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)
- Two to five options that fit on screen: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)
- Actions, not values: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label; it names the button and the list. |
| `options` | `SelectOption<T>[]` |  | Required. { value, label, disabled? } for each option; value is a string or number. |
| `value / defaultValue` | `T \| null` |  | The chosen value, controlled or not. |
| `onChange` | `(value: T) => void` |  | Called with the value of the picked option. |
| `placeholder` | `string` | `''` | Shown while nothing is chosen. |
| `error` | `string` |  | The translated error. Marks the field invalid and announces the message. |
| `disabled` | `boolean` | `false` | Disables the select. |
| `name` | `string` |  | Field name, so the value is sent with a native form. |
| `testId` | `string` |  | data-testid on the button; options get -option-<index>. |

## Examples

### Basic

```tsx
const cities: SelectOption<string>[] = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
];
const [city, setCity] = useState<string | null>(null);

<Select
  label="City"
  placeholder="Choose a city"
  options={cities}
  value={city}
  onChange={setCity}
/>
```

### With an error

```tsx
const sizes: SelectOption<string>[] = [
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large', disabled: true },
];

<Select label="Size" options={sizes} error="Choose a size" />
```

### In Arabic

```tsx
{/* dir="rtl" on the page or any ancestor */}
<Select label="المدينة" placeholder="اختار المدينة" options={cities} />
```
