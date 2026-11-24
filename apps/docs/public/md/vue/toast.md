# Toast

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short note after an action, such as Saved, at the bottom end of the screen. Screen readers hear it as it comes. It closes by itself after 6 seconds, but never while the pointer or focus is on it, and never when it holds an action, so nobody loses the Undo to a timer.

Docs: https://lamsa-ui.github.io/lamsa/components/toast

```ts
import { ToastProvider, useToast } from '@lamsa-ui/vue';

<!-- Once, around the app (App.vue): -->
<ToastProvider><RouterView /></ToastProvider>
```

When to use something else:

- A message that must stay until it is fixed: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)
- A decision the reader must make now: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `<ToastProvider>` | `component` |  | Once, around the app. label names the region; closeLabel names each × button. |
| `useToast().show(message, options?)` | `number` |  | Shows a toast and returns its id. options: tone, title, duration (ms, 0 keeps it), action { label, run }. |
| `useToast().dismiss(id)` | `void` |  | Removes a toast early. |

Keyboard and screen readers:

- Tab: Reach the action or the close button inside a toast.
- Toasts sit in a named live region, so each one is read as it comes.
- The timer waits while the pointer or focus is on a toast, and never runs on one with an action.

## Examples

### Tones

Danger is announced at once; the others wait for the screen reader to finish.

```vue
const toast = useToast();
toast.show('Address saved', { tone: 'success' });
toast.show('The card was declined. Try another card.', { tone: 'danger', title: 'Payment failed' });
```

### With an action

It stays until it is closed or its button is pressed.

```vue
toast.show('Order 1042 deleted', {
  action: { label: 'Undo', run: () => restore(order) },
});
```

### In Arabic

```vue
// provideUiLabels(arabicLabels) in App.vue names the region and close buttons
<ToastProvider>…</ToastProvider>
```
