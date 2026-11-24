# Tag

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A label the user added or can take away, such as an active filter or a topic. For a status like Paid or Late, use a badge.

Docs: https://lamsa-ui.github.io/lamsa/components/tag

```tsx
import { Tag } from '@lamsa-ui/react';
```

When to use something else:

- A status the user cannot remove: [Badge](https://lamsa-ui.github.io/lamsa/components/badge)
- Let the user type new labels: [Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `onRemove` | `() => void` |  | Shows the × button and is called when it is pressed. Remove the tag and move focus on. |
| `removeLabel` | `string` | `'Remove' from labels` | The button's first word; the tag's text follows it. Translate it. |
| `...props` | `span props` |  | Every native span prop. |

Keyboard and screen readers:

- Enter or Space: On the remove button, take the tag away.
- The remove button is named after the tag, such as Remove Angular.

## Examples

### Labels

```tsx
<ul className="flex flex-wrap gap-2" aria-label="Topics">
  <li><Tag>Angular</Tag></li>
  <li><Tag>React</Tag></li>
</ul>
```

### Removable

The × is read as 'Remove Paid'. After a tag goes, focus moves to the next tag, or to Reset when none is left, so the keyboard never drops to the top of the page.

```tsx
<ul className="flex flex-wrap gap-2" aria-label="Active filters">
  {filters.map((filter, i) => (
    <li key={filter}>
      <Tag onRemove={() => drop(i)}>{filter}</Tag>
    </li>
  ))}
</ul>
{/* In drop(): remove it, then focus the next tag's × button */}
```

### In Arabic

```tsx
<Tag onRemove={() => drop(0)} removeLabel="إزالة">القاهرة</Tag>
```
