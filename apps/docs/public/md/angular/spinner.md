# Spinner

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Shows that something is loading and says what, in words, to screen readers. Keep it for waits of more than a second. With reduced motion it stops turning and stays as a faint ring.

Docs: https://lamsa-ui.github.io/lamsa/components/spinner

```ts
import { SpinnerComponent } from '@lamsa-ui/angular';
```

When to use something else:

- Work with a known length: [Progress](https://lamsa-ui.github.io/lamsa/components/progress)
- A whole page or card that is loading: [Skeleton](https://lamsa-ui.github.io/lamsa/components/skeleton)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` | `'Loading'` | What is loading, translated; read by screen readers. |
| `showLabel` | `boolean` | `false` | Shows the label next to it too. |
| `size` | `'md' \| 'lg'` | `'md'` | lg: a big spinner over its label, for a page or panel. |

## Examples

### Sizes and labels

```html
<ui-spinner label="Loading orders" />
<ui-spinner label="Loading orders" showLabel />
<ui-spinner label="Loading the report" size="lg" showLabel />
```

### In a button

A busy button already has a spinner: use its loading input, not a second spinner.

```html
<button ui-button [loading]="saving()">Save</button>
```

### In Arabic

```html
<ui-spinner label="بنحمّل الطلبات" showLabel />
```
