# Alert dialog

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short message that needs an answer before the reader goes on: confirm a delete, keep or discard changes. Only its buttons answer: Escape and a click outside do nothing, because the reader has to choose. Focus starts on the safest button.

Docs: https://lamsa-ui.github.io/lamsa/components/alert-dialog

```ts
import { useAlertDialog } from '@lamsa-ui/vue';

const { alert, confirm, dialog } = useAlertDialog();
// render <component :is="dialog" /> once in the template, then await alert() or confirm()
```

When to use something else:

- Ask for more than a yes or no, such as a form: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)
- Confirm something that can be undone: [Toast with an Undo action](https://lamsa-ui.github.io/lamsa/components/toast)
- Warn about something on the page without stopping the reader: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `useAlertDialog()` | `{ alert, confirm, dialog }` |  | Render dialog once; alert() and confirm() return promises. |
| `alert(options)` | `Promise<R \| undefined>` |  | The value of the pressed action. |
| `confirm(options)` | `Promise<boolean>` |  | true only when the confirm button is pressed. |
| `options` | `as in Angular` |  | title, message, tone and actions; confirmLabel, cancelLabel and danger for confirm. |
| `<AlertDialog>` | `component` |  | The same dialog, controlled: open, the options, and onAction(value). |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between its buttons; focus stays inside.
- Escape and a click outside do nothing: only its buttons answer.
- Focus starts on the safest button, and the title and message are read when it opens.

## Examples

### Confirm a destructive action

The danger tone shows an icon, and the title says it in words. Focus starts on Cancel, so pressing Enter by habit deletes nothing.

```vue
<script setup lang="ts">
import { Button, useAlertDialog } from '@lamsa-ui/vue';

const { confirm, dialog } = useAlertDialog();

async function remove() {
  const confirmed = await confirm({
    title: 'Delete report.pdf?',
    message: 'It is removed for everyone. This cannot be undone.',
    confirmLabel: 'Delete',
    danger: true,
  });
  if (confirmed) { /* delete */ }
}
</script>

<template>
  <component :is="dialog" />
  <Button variant="danger" @click="remove">Delete file</Button>
</template>
```

### More than two answers

Up to three actions, in reading order. Mark the one focus should start on.

```vue
const choice = await alert({
  title: 'Unsaved changes',
  message: 'You changed the delivery address. Save it before you leave?',
  tone: 'warning',
  actions: [
    { label: 'Discard', value: 'discard', variant: 'danger' },
    { label: 'Keep editing', value: 'stay' },
    { label: 'Save', value: 'save', variant: 'primary', initialFocus: true },
  ],
});
// 'discard' | 'stay' | 'save'
```

### Tell, then move on

One action for news the reader should not miss. Keep these rare: most news belongs in the page, not in a dialog.

```vue
await alert({
  title: 'Order paid',
  message: 'Order #1042 is paid. The kitchen starts preparing it now.',
  tone: 'success',
  actions: [{ label: 'OK', value: true, variant: 'primary' }],
});
```
