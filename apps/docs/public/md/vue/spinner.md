# Spinner

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Shows that something is loading and says what, in words, to screen readers. Keep it for waits of more than a second. With reduced motion it stops turning and stays as a faint ring.

Docs: https://ghazal-ui.github.io/ghazal/components/spinner

```ts
import { Spinner } from '@ghazal-ui/vue';
```

When to use something else:

- Work with a known length: [Progress](https://ghazal-ui.github.io/ghazal/components/progress)
- A whole page or card that is loading: [Skeleton](https://ghazal-ui.github.io/ghazal/components/skeleton)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` | `'Loading' from labels` | What is loading, translated. |
| `showLabel` | `boolean` | `false` | Shows the label next to it too. |
| `size` | `'md' \| 'lg'` | `'md'` | lg: a big spinner over its label. |

Keyboard and screen readers:

- Says what is loading, in words, to screen readers.
- With reduced motion it stops turning and stays as a faint ring.

## Examples

### Sizes and labels

```vue
<Spinner label="Loading orders" />
<Spinner label="Loading orders" showLabel />
<Spinner label="Loading the report" size="lg" showLabel />
```

### In a button

A busy button already has a spinner: use its loading input, not a second spinner.

```vue
<Button :loading="saving">Save</Button>
```

### In Arabic

```vue
<Spinner label="بنحمّل الطلبات" showLabel />
```
