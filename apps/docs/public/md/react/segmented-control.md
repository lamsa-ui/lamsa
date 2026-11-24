# Segmented control

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

One choice from two to five short options, side by side: a view, a period, a size. Radio buttons underneath, so Tab reaches the group and the arrow keys move the choice. The chosen one is lifted onto a tile with an edge, not just coloured.

Docs: https://ghazal-ui.github.io/ghazal/components/segmented-control

```tsx
import { SegmentedControl } from '@ghazal-ui/react';
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
| `value \| defaultValue \| onChange` | `string` |  | Controlled or starting choice. |
| `disabled \| name` | `boolean \| string` |  | Passed to the radios. |

Keyboard and screen readers:

- Tab: Reach the group, on the chosen option.
- Arrow keys: Move the choice to the next or previous option.
- Radio buttons underneath; the chosen option is lifted onto a tile with an edge, not only coloured.

## Examples

### A period

```tsx
<SegmentedControl label="Period" options={periods} value={period} onChange={setPeriod} />
```

### Icons only

The words stay for screen readers. Keep icons that everyone reads the same way.

```tsx
<SegmentedControl label="View" iconOnly options={views} value={view} onChange={setView} />
```

### Full width

block shares the width equally, as in a narrow panel or on a phone.

```tsx
<SegmentedControl label="Delivery" block options={delivery} value={speed} onChange={setSpeed} />
```

### In Arabic

```tsx
<SegmentedControl label="الفترة" options={periods} value={period} onChange={setPeriod} />
```
