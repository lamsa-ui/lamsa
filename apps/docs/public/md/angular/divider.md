# Divider

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A thin line between groups of content. Reach for space first: a divider is for when space alone does not show where one group ends.

Docs: https://lamsa-ui.github.io/lamsa/components/divider

```ts
import { DividerComponent } from '@lamsa-ui/angular';
```

When to use something else:

- A frame around a group: [Card](https://lamsa-ui.github.io/lamsa/components/card)
- Space between groups: Tailwind gap or margin classes

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Which way the line runs. |
| `label` | `string` |  | Words in the middle of the line, read as text. Horizontal only. |

## Examples

### Between sections

```html
<ui-divider />
```

### With words

The words are read as normal text, so a screen reader hears 'or' between the two choices.

```html
<ui-divider label="or" />
```

### Vertical

Between items in a row. It stretches to the row's height.

```html
<div class="flex items-center gap-3">
  <span>18 orders</span>
  <ui-divider orientation="vertical" />
  <span>3 in the kitchen</span>
</div>
```

### In Arabic

```html
<ui-divider label="أو" />
```
