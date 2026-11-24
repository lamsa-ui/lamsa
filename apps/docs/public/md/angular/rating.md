# Rating

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Stars out of five, to pick a score or to show one. Picking uses real radio buttons, so Tab reaches the stars, arrow keys move between them and a screen reader says 3 stars, 3 of 5. Filled stars are solid and empty ones an outline, so the shape tells them apart, not only colour.

Docs: https://lamsa-ui.github.io/lamsa/components/rating

```ts
import { RatingComponent } from '@lamsa-ui/angular';
// The value is a number, or null before a pick. Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- An exact number: [Number field](https://lamsa-ui.github.io/lamsa/components/number-field)
- Show a score the reader cannot change: [Meter](https://lamsa-ui.github.io/lamsa/components/meter)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the stars, as the fieldset legend. Required when people pick. |
| `max` | `number` | `5` | How many stars. |
| `starLabel` | `(stars: number) => string` | ``${n} stars`` | The name of one star, read by screen readers. Translate it. |
| `scoreLabel` | `(value, max) => string` | ``${v} out of ${m} stars`` | The read-only score in words. Translate it. |
| `readonly` | `boolean` | `false` | Only shows [value]; nothing to pick. |
| `value` | `number` |  | The score to show when readonly. A form control sets it otherwise. |

Keyboard and screen readers:

- Tab: Reach the group, on the chosen option.
- Arrow keys: Move the choice to the next or previous option.
- Real radio buttons, read as 3 stars, 3 of 5.
- Filled stars are solid and empty ones an outline, so shape tells them apart.

## Examples

### Pick a score

```html
<ui-rating label="How was the food?" formControlName="food" />
```

### Show a score

Read as one image with the score in words. A score with a fraction fills to the nearest star; the words keep the exact number.

```html
<ui-rating [value]="4.6" readonly />
<span>4.6 from 212 orders</span>
```

### In Arabic

```html
<ui-rating label="ما رأيك في الأكل؟" [starLabel]="star" formControlName="food" />

star = (n: number) => n === 1 ? 'نجمة واحدة' : n === 2 ? 'نجمتان' : `${n.toLocaleString('ar-EG')} نجوم`;
```
