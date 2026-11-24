# Empty state

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

What a list, table or page shows while it has nothing in it. It says what will appear here, why it is empty now, and offers the one action that fills it.

Docs: https://ghazal-ui.github.io/ghazal/components/empty-state

```ts
import { EmptyStateComponent } from '@ghazal-ui/angular';
```

When to use something else:

- Content that is still loading: [Skeleton](https://ghazal-ui.github.io/ghazal/components/skeleton)
- Something went wrong: [Alert](https://ghazal-ui.github.io/ghazal/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `title` | `string` |  | Required. What is missing, as a heading. |
| `level` | `2 \| 3 \| 4` | `3` | Heading level of the title, so it fits the page outline. |
| `[ui-empty-state-actions]` | `slot` |  | The action that fills the space. One, usually. |

Keyboard and screen readers:

- Its title is a heading, at the level you set so it fits the page outline.

## Examples

### First use

Nothing has been made yet: name what goes here and give the action that makes the first one.

```html
<ui-empty-state title="No orders yet">
  <p>Orders show here as soon as a customer pays.</p>
  <div ui-empty-state-actions>
    <button ui-button>Share your menu</button>
  </div>
</ui-empty-state>
```

### No results

A search or filter matched nothing: say so, and give the way back.

```html
<ui-empty-state title="No orders match “Mohamed”">
  <p>Check the spelling, or search by order number.</p>
  <div ui-empty-state-actions>
    <button ui-button variant="secondary">Clear search</button>
  </div>
</ui-empty-state>
```

### In Arabic

```html
<ui-empty-state title="لا توجد طلبات بعد">
  <p>تظهر الطلبات هنا بمجرد أن يدفع العميل.</p>
</ui-empty-state>
```
