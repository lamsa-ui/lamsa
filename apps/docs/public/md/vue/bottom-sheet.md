# Bottom sheet

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A panel that slides up from the bottom of the screen, for a short choice or the details of an item, mostly on phones. It is a dialog docked to the bottom: focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click above it closes it.

Docs: https://ghazal-ui.github.io/ghazal/components/bottom-sheet

```ts
import { Dialog } from '@ghazal-ui/vue';
```

When to use something else:

- A task on a wide screen: [Dialog](https://ghazal-ui.github.io/ghazal/components/dialog)
- Navigation or filters that slide in from the side: [Drawer](https://ghazal-ui.github.io/ghazal/components/drawer)
- A short list of actions: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'alert' \| 'drawer' \| 'sheet'` | `'default'` | 'sheet': docked to the bottom. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Its width on a wide screen: 24, 32 or 48rem. The full width on a phone. |
| `everything else` | `Dialog API` |  | title, description, open, onOpenChange, actions, dismissable and closeLabel work as in the dialog. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between the controls inside; focus stays inside.
- Escape: Close, and put focus back on the button that opened it.
- A dialog docked to the bottom, named by its title; the page behind stops scrolling.

## Examples

### Order details

The title and the actions stay in view; the details sit between them.

```vue
<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">Order 1042</Button>
  <Dialog v-model:open="open"
    variant="sheet"
    title="Order 1042"
    description="Delivered today at 2:40 pm."
  >
    <p>2 × Chicken shawarma, 1 × Lentil soup</p>
    <template #actions>
      <Button variant="secondary" @click="open = false">Close</Button>
      <Button @click="reorder">Order again</Button>
    </template>
  </Dialog>
</template>
```
