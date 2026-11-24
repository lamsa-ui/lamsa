# Divider

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A thin line between groups of content. Reach for space first: a divider is for when space alone does not show where one group ends.

Docs: https://ghazal-ui.github.io/ghazal/components/divider

```tsx
import { Divider } from '@ghazal-ui/react';
```

When to use something else:

- A frame around a group: [Card](https://ghazal-ui.github.io/ghazal/components/card)
- Space between groups: Tailwind gap or margin classes

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Which way the line runs. |
| `label` | `string` |  | Words in the middle of the line, read as text. Horizontal only. |
| `...props` | `div props` |  | Every native div prop. |

Keyboard and screen readers:

- Read as a separator; a divider with words in the middle is read as those words instead.

## Examples

### Between sections

```tsx
<Divider />
```

### With words

The words are read as normal text, so a screen reader hears 'or' between the two choices.

```tsx
<Divider label="or" />
```

### Vertical

Between items in a row. It stretches to the row's height.

```tsx
<div className="flex items-center gap-3">
  <span>18 orders</span>
  <Divider orientation="vertical" />
  <span>3 in the kitchen</span>
</div>
```

### In Arabic

```tsx
<Divider label="أو" />
```
