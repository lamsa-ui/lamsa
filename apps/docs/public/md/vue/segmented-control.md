# Segmented control

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

One choice from two to five short options, side by side: a view, a period, a size. Radio buttons underneath, so Tab reaches the group and the arrow keys move the choice. The chosen one is lifted onto a tile with an edge, not just coloured.

Docs: https://ghazal-ui.github.io/ghazal/components/segmented-control

```ts
import { SegmentedControl } from '@ghazal-ui/vue';
```

When to use something else:

- Show different panels of content: [Tabs](https://ghazal-ui.github.io/ghazal/components/tabs)
- A choice sent with a form: [Radio group](https://ghazal-ui.github.io/ghazal/components/radio-group)
- One option that is on or off: [Toggle](https://ghazal-ui.github.io/ghazal/components/toggle)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the group for screen readers. |
| `options` | `{ value, label, icon?, disabled? }[]` |  | Two to five short options. |
| `iconOnly` | `boolean` | `false` | Shows only the icons; the words are still read. |
| `block` | `boolean` | `false` | Fills the width, segments sharing it. |
| `v-model` | `string` |  | The picked value. |
| `disabled \| name` | `boolean \| string` |  | For the radios underneath. |

Keyboard and screen readers:

- Tab: Reach the group, on the chosen option.
- Arrow keys: Move the choice to the next or previous option.
- Radio buttons underneath; the chosen option is lifted onto a tile with an edge, not only coloured.

## Examples

### A period

```vue
<SegmentedControl label="Period" :options="periods" v-model="period" />
```

### Icons only

The words stay for screen readers. Keep icons that everyone reads the same way.

```vue
<SegmentedControl label="View" iconOnly :options="views" v-model="view" />
```

### Full width

block shares the width equally, as in a narrow panel or on a phone.

```vue
<SegmentedControl label="Delivery" block :options="delivery" v-model="speed" />
```

### In Arabic

```vue
<SegmentedControl label="الفترة" :options="periods" v-model="period" />
```
