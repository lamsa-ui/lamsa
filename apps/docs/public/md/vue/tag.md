# Tag

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A label the user added or can take away, such as an active filter or a topic. For a status like Paid or Late, use a badge.

Docs: https://ghazal-ui.github.io/ghazal/components/tag

```ts
import { Tag } from '@ghazal-ui/vue';
```

When to use something else:

- A status the user cannot remove: [Badge](https://ghazal-ui.github.io/ghazal/components/badge)
- Let the user type new labels: [Chip input](https://ghazal-ui.github.io/ghazal/components/chip-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `@remove` | `event` |  | Shows the × button and is called when it is pressed. Remove the tag and move focus on. |
| `removeLabel` | `string` | `'Remove' from labels` | The button's first word; the tag's text follows it. Translate it. |

Keyboard and screen readers:

- Enter or Space: On the remove button, take the tag away.
- The remove button is named after the tag, such as Remove Angular.

## Examples

### Labels

```vue
<ul class="flex flex-wrap gap-2" aria-label="Topics">
  <li><Tag>Angular</Tag></li>
  <li><Tag>React</Tag></li>
</ul>
```

### Removable

The × is read as 'Remove Paid'. After a tag goes, focus moves to the next tag, or to Reset when none is left, so the keyboard never drops to the top of the page.

```vue
<ul class="flex flex-wrap gap-2" aria-label="Active filters">
  <li v-for="(filter, i) in filters" :key="filter">
    <Tag @remove="drop(i)">{{ filter }}</Tag>
  </li>
</ul>
<!-- In drop(): remove it, then focus the next tag's × button -->
```

### In Arabic

```vue
<Tag @remove="drop(0)" removeLabel="إزالة">القاهرة</Tag>
```
