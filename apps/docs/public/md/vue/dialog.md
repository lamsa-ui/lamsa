# Dialog

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A modal window for a task that needs the reader's full attention: a short form, details, terms. Focus moves into it and stays there, the page behind stops scrolling, and Escape, the close button or a click outside closes it.

Docs: https://lamsa-ui.github.io/lamsa/components/dialog

```ts
import { Dialog } from '@lamsa-ui/vue';
```

When to use something else:

- A yes or no question that must be answered: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)
- Content beside the page, such as filters: [Drawer](https://lamsa-ui.github.io/lamsa/components/drawer)
- A short note next to the button: [Popover](https://lamsa-ui.github.io/lamsa/components/popover)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `title` | `string` |  | Required. The heading; it names the dialog. |
| `v-model:open` | `boolean` |  | Required. Set to false by Escape, the backdrop or the close button. |
| `description` | `string` |  | A sentence under the title, read with it. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 24, 32 or 48rem wide, never wider than the screen. |
| `#actions` | `slot` |  | The buttons; they line up at the end and stay in view. |
| `dismissable` | `boolean` | `true` | false: only your own buttons close it. Escape and a click outside do nothing, and the close button is hidden. |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button; pass the translated text. |

## Examples

### A form in a dialog

The title names the dialog and the description is read with it. The actions stay at the bottom.

```vue
<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <Button @click="open = true">Edit address</Button>
  <Dialog v-model:open="open"
    title="Edit address"
    description="We deliver your next orders here."
  >
    <TextField label="Street" name="street" />
    <TextField label="Building" name="building" />
    <template #actions>
      <Button variant="secondary" @click="open = false">Cancel</Button>
      <Button @click="save">Save</Button>
    </template>
  </Dialog>
</template>
```

### Long content

When the content is longer than the screen, only the body scrolls: the title and the buttons stay in view. The large size suits reading.

```vue
<Dialog v-model:open="open" title="Terms of ordering" size="lg">
  <p>...</p>
  <template #actions>
    <Button @click="open = false">Close</Button>
  </template>
</Dialog>
```

### Only its buttons close it

For a form that a stray click or key must not throw away: a click outside and Escape do nothing, and the close button is hidden, so Cancel and Save are the way out. Works the same on a drawer and a bottom sheet.

```vue
<Dialog v-model:open="open" :dismissable="false" title="Note for the driver">
  ...
</Dialog>
```
