# Segmented control

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

One choice from two to five short options, side by side: a view, a period, a size. Radio buttons underneath, so Tab reaches the group and the arrow keys move the choice. The chosen one is lifted onto a tile with an edge, not just coloured.

Docs: https://lamsa-ui.github.io/lamsa/components/segmented-control

```ts
import { SegmentedControlComponent } from '@lamsa-ui/angular';
// Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- Show different panels of content: [Tabs](https://lamsa-ui.github.io/lamsa/components/tabs)
- A choice sent with a form: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)
- One option that is on or off: [Toggle](https://lamsa-ui.github.io/lamsa/components/toggle)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the group for screen readers. |
| `options` | `{ value, label, icon?, disabled? }[]` |  | Two to five short options. |
| `iconOnly` | `boolean` | `false` | Shows only the icons; the words are still read. |
| `block` | `boolean` | `false` | Fills the width, segments sharing it. |

## Examples

### A period

```html
<ui-segmented-control label="Period" [options]="periods" formControlName="period" />

periods = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];
```

### Icons only

The words stay for screen readers. Keep icons that everyone reads the same way.

```html
<ui-segmented-control label="View" iconOnly [options]="views" formControlName="view" />

views = [
  { value: 'list', label: 'List', icon: 'list' },
  { value: 'grid', label: 'Grid', icon: 'layout-grid' },
];
```

### Full width

block shares the width equally, as in a narrow panel or on a phone.

```html
<ui-segmented-control label="Delivery" block [options]="delivery" formControlName="speed" />
```

### In Arabic

```html
<ui-segmented-control label="الفترة" [options]="periods" formControlName="period" />
```
