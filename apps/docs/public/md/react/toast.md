# Toast

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short note after an action, such as Saved, at the bottom end of the screen. Screen readers hear it as it comes. It closes by itself after 6 seconds, but never while the pointer or focus is on it, and never when it holds an action, so nobody loses the Undo to a timer.

Docs: https://lamsa-ui.github.io/lamsa/components/toast

```tsx
import { ToastProvider, useToast } from '@lamsa-ui/react';

// Once, around the app:
<ToastProvider label="Notifications" closeLabel="Dismiss">{app}</ToastProvider>
```

When to use something else:

- A message that must stay until it is fixed: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)
- A decision the reader must make now: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `<ToastProvider>` | `component` |  | Once around the app. Takes label and closeLabel. |
| `useToast().show(message, options?)` | `number` |  | As in Angular. |
| `useToast().dismiss(id)` | `void` |  | Closes a toast. |

## Examples

### Tones

Danger is announced at once; the others wait for the screen reader to finish.

```tsx
const toast = useToast();
toast.show('Address saved', { tone: 'success' });
toast.show('The card was declined. Try another card.', { tone: 'danger', title: 'Payment failed' });
```

### With an action

It stays until it is closed or its button is pressed.

```tsx
toast.show('Order 1042 deleted', {
  action: { label: 'Undo', run: () => restore(order) },
});
```

### In Arabic

```tsx
<ToastProvider label="الإشعارات" closeLabel="إخفاء">…</ToastProvider>
```
