# Toast

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A short note after an action, such as Saved, at the bottom end of the screen. Screen readers hear it as it comes. It closes by itself after 6 seconds, but never while the pointer or focus is on it, and never when it holds an action, so nobody loses the Undo to a timer.

Docs: https://ghazal-ui.github.io/ghazal/components/toast

```tsx
import { ToastProvider, useToast } from '@ghazal-ui/react';

// Once, around the app:
<ToastProvider>{app}</ToastProvider>
```

When to use something else:

- A message that must stay until it is fixed: [Alert](https://ghazal-ui.github.io/ghazal/components/alert)
- A decision the reader must make now: [Alert dialog](https://ghazal-ui.github.io/ghazal/components/alert-dialog)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `<ToastProvider>` | `component` |  | Once around the app. Takes label and closeLabel; they default to UiLabelsProvider. |
| `useToast().show(message, options?)` | `number` |  | As in Angular. |
| `useToast().dismiss(id)` | `void` |  | Closes a toast. |

Keyboard and screen readers:

- Tab: Reach the action or the close button inside a toast.
- Toasts sit in a named live region, so each one is read as it comes.
- The timer waits while the pointer or focus is on a toast, and never runs on one with an action.

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
<UiLabelsProvider labels={arabicLabels}>
  <ToastProvider>…</ToastProvider>
</UiLabelsProvider>
```
