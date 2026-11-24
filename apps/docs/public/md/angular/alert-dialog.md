# Alert dialog

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short message that needs an answer before the reader goes on: confirm a delete, keep or discard changes. Only its buttons answer: Escape and a click outside do nothing, because the reader has to choose. Focus starts on the safest button.

Docs: https://lamsa-ui.github.io/lamsa/components/alert-dialog

```ts
import { UiAlertDialog } from '@lamsa-ui/angular';

private readonly alerts = inject(UiAlertDialog);
```

When to use something else:

- Ask for more than a yes or no, such as a form: [Dialog](https://lamsa-ui.github.io/lamsa/components/dialog)
- Confirm something that can be undone: [Toast with an Undo action](https://lamsa-ui.github.io/lamsa/components/toast)
- Warn about something on the page without stopping the reader: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `alert(options)` | `Promise<R \| undefined>` |  | The value of the pressed action. |
| `confirm(options)` | `Promise<boolean>` |  | true only when the confirm button is pressed. |
| `options.title / message` | `string` |  | Required. The question, and what happens. Plain text, never HTML. |
| `options.tone` | `'info' \| 'success' \| 'warning' \| 'danger'` |  | Shown as an icon; say it in the title too. |
| `options.actions` | `{ label, value, variant?, initialFocus? }[]` |  | One to three buttons. Focus starts on the marked one, else the first that is not danger. |
| `confirm: confirmLabel / cancelLabel` | `string` | `cancel: 'Cancel'` | The translated button texts. |
| `confirm: danger` | `boolean` | `false` | Danger tone and button, and focus starts on Cancel. |

Keyboard and screen readers:

- Tab or Shift + Tab: Move between its buttons; focus stays inside.
- Escape and a click outside do nothing: only its buttons answer.
- Focus starts on the safest button, and the title and message are read when it opens.

## Examples

### Confirm a destructive action

The danger tone shows an icon, and the title says it in words. Focus starts on Cancel, so pressing Enter by habit deletes nothing.

```html
async remove() {
  const confirmed = await this.alerts.confirm({
    title: 'Delete report.pdf?',
    message: 'It is removed for everyone. This cannot be undone.',
    confirmLabel: 'Delete',
    danger: true,
  });
  if (confirmed) { /* delete */ }
}
```

### More than two answers

Up to three actions, in reading order. Mark the one focus should start on.

```html
const choice = await this.alerts.alert({
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

```html
await this.alerts.alert({
  title: 'Order paid',
  message: 'Order #1042 is paid. The kitchen starts preparing it now.',
  tone: 'success',
  actions: [{ label: 'OK', value: true, variant: 'primary' }],
});
```
