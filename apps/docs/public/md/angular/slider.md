# Slider

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A value picked along a range, such as a price limit or a volume. It is the browser's own range input, so arrow keys, Page Up and Down, Home and End all move it, and the value is written beside the label. For an exact number, use a number field.

Docs: https://lamsa-ui.github.io/lamsa/components/slider

```ts
import { SliderComponent } from '@lamsa-ui/angular';
// The value is a number. Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- An exact value: [Number field](https://lamsa-ui.github.io/lamsa/components/number-field)
- Show a level the reader cannot change: [Meter](https://lamsa-ui.github.io/lamsa/components/meter)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the slider. |
| `min \| max` | `number` | `0 \| 100` | The ends of the range. |
| `step` | `number` | `1` | How far one arrow key press moves it. |
| `format` | `(value: number) => string` |  | The value as shown and as read aloud, with its unit. |
| `hint` | `string` |  | Help under the slider, read after the label. |

## Examples

### With a unit

format turns the number into what people read and hear, so a screen reader says EGP 500, not 500.

```html
<ui-slider
  label="Price limit"
  hint="Only dishes under this price show."
  [max]="2000"
  [step]="50"
  [format]="egp"
  formControlName="price"
/>

egp = (v: number) => `EGP ${v.toLocaleString('en')}`;
```

### Disabled

```html
volume = new FormControl({ value: 40, disabled: true });
```

### In Arabic

The track fills from the right.

```html
<ui-slider label="أقصى سعر" [max]="2000" [step]="50"
  [format]="egp" formControlName="price" />

egp = (v: number) => `${v.toLocaleString('ar-EG')} جنيه`;
```
