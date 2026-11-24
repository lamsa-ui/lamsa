# Empty state

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

What a list, table or page shows while it has nothing in it. It says what will appear here, why it is empty now, and offers the one action that fills it.

Docs: https://ghazal-ui.github.io/ghazal/components/empty-state

```ts
import { EmptyState } from '@ghazal-ui/vue';
```

When to use something else:

- Content that is still loading: [Skeleton](https://ghazal-ui.github.io/ghazal/components/skeleton)
- Something went wrong: [Alert](https://ghazal-ui.github.io/ghazal/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `title` | `string` |  | Required. What is missing, as a heading. |
| `level` | `2 \| 3 \| 4` | `3` | Heading level of the title, so it fits the page outline. |
| `#actions` | `slot` |  | The action that fills the space. One, usually. |

Keyboard and screen readers:

- Its title is a heading, at the level you set so it fits the page outline.

## Examples

### First use

Nothing has been made yet: name what goes here and give the action that makes the first one.

```vue
<EmptyState title="No orders yet">
  <p>Orders show here as soon as a customer pays.</p>
  <template #actions>
    <Button>Share your menu</Button>
  </template>
</EmptyState>
```

### No results

A search or filter matched nothing: say so, and give the way back.

```vue
<EmptyState title="No orders match “Mohamed”">
  <p>Check the spelling, or search by order number.</p>
  <template #actions>
    <Button variant="secondary">Clear search</Button>
  </template>
</EmptyState>
```

### In Arabic

```vue
<EmptyState title="لا توجد طلبات بعد">
  <p>تظهر الطلبات هنا بمجرد أن يدفع العميل.</p>
</EmptyState>
```
