# Drawer

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A side panel that slides in from the edge, for a form or the details of a row, while the list stays in sight. It is a dialog docked to the side: focus moves into it and stays there, the page behind stops scrolling, only the body scrolls, and Escape, the close button or a click outside closes it.

Docs: https://lamsa-ui.github.io/lamsa/components/drawer

```ts
import { Dialog } from '@lamsa-ui/vue';
```

When to use something else:

- A focused task in the middle of the screen: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)
- A panel on a phone: [Bottom sheet](https://lamsa-ui.github.io/lamsa/components/bottom-sheet)
- The main links of the app on a phone: [App shell](https://lamsa-ui.github.io/lamsa/components/app-shell)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'alert' \| 'drawer'` | `'default'` | 'drawer': full height on the inline end. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24, 32 or 48rem wide; the full width on a phone. |
| `everything else` | `Dialog API` |  | title, description, open, onOpenChange, actions, dismissable and closeLabel work as in the dialog. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between the controls inside; focus stays inside.
- Escape: Close, and put focus back on the button that opened it.
- A dialog docked to the side, named by its title; the page behind stops scrolling.

## Examples

### A form in a drawer

Header and actions stay at the top and bottom of the screen; the fields scroll between them.

```vue
<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">Add building</Button>
  <Dialog v-model:open="open"
    variant="drawer"
    title="Add building"
    description="It shows in the list once saved."
  >
    <TextField label="Name" name="name" />
    <TextField label="Address" name="address" />
    <template #actions>
      <Button variant="secondary" @click="open = false">Cancel</Button>
      <Button @click="save">Save</Button>
    </template>
  </Dialog>
</template>
```

### In Arabic

```vue
<!-- <html dir="rtl" lang="ar"> is all it takes; nothing changes in the drawer -->
<Dialog v-model:open="open" variant="drawer" title="إضافة مبنى" closeLabel="إغلاق">
  <TextField label="اسم المبنى" />
</Dialog>
```
