# Rating

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Stars out of five, to pick a score or to show one. Picking uses real radio buttons, so Tab reaches the stars, arrow keys move between them and a screen reader says 3 stars, 3 of 5. Filled stars are solid and empty ones an outline, so the shape tells them apart, not only colour.

Docs: https://lamsa-ui.github.io/lamsa/components/rating

```ts
import { Rating } from '@lamsa-ui/vue';
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
| `readOnly` | `boolean` | `false` | Shows a score as stars, for reading only. |
| `v-model` | `number \| null` |  | The score. |
| `name \| disabled` | `string \| boolean` |  | For the radios underneath. |
| `@blur` | `event` |  | When focus leaves a star. |

## Examples

### Pick a score

```vue
<Rating label="How was the food?" v-model="food" />
```

### Show a score

Read as one image with the score in words. A score with a fraction fills to the nearest star; the words keep the exact number.

```vue
<Rating :value="4.6" readOnly />
<span>4.6 from 212 orders</span>
```

### In Arabic

```vue
<Rating label="ما رأيك في الأكل؟" :starLabel="star" v-model="food" />
```
