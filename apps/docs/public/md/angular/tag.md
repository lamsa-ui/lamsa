# Tag

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A label the user added or can take away, such as an active filter or a topic. For a status like Paid or Late, use a badge.

Docs: https://lamsa-ui.github.io/lamsa/components/tag

```ts
import { TagComponent } from '@lamsa-ui/angular';
```

When to use something else:

- A status the user cannot remove: [Badge](https://lamsa-ui.github.io/lamsa/components/badge)
- Let the user type new labels: [Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `removable` | `boolean` | `false` | Shows the × button. |
| `removeLabel` | `string` | `'Remove'` | The button's first word; the tag's text follows it. Translate it. |
| `(remove)` | `void` |  | The × was pressed. Remove the tag and move focus on. |

Keyboard and screen readers:

- Enter or Space: On the remove button, take the tag away.
- The remove button is named after the tag, such as Remove Angular.

## Examples

### Labels

```html
<ul class="flex flex-wrap gap-2" aria-label="Topics">
  <li><ui-tag>Angular</ui-tag></li>
  <li><ui-tag>React</ui-tag></li>
</ul>
```

### Removable

The × is read as 'Remove Paid'. After a tag goes, focus moves to the next tag, or to Reset when none is left, so the keyboard never drops to the top of the page.

```html
<ul class="flex flex-wrap gap-2" aria-label="Active filters">
  @for (filter of filters(); track filter; let i = $index) {
    <li>
      <ui-tag removable (remove)="drop(i)">{{ filter }}</ui-tag>
    </li>
  }
</ul>
<!-- In drop(): remove it, then focus the next tag's × button -->
```

### In Arabic

```html
<ui-tag removable removeLabel="إزالة" (remove)="drop(0)">القاهرة</ui-tag>
```
