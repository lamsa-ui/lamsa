# Toast

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short note after an action, such as Saved, at the bottom end of the screen. Screen readers hear it as it comes. It closes by itself after 6 seconds, but never while the pointer or focus is on it, and never when it holds an action, so nobody loses the Undo to a timer.

Docs: https://lamsa-ui.github.io/lamsa/components/toast

```ts
import { UiToast } from '@lamsa-ui/angular';

const toast = inject(UiToast);
toast.labels.set({ region: 'Notifications', close: 'Dismiss' }); // translated, once
```

When to use something else:

- A message that must stay until it is fixed: [Alert](https://lamsa-ui.github.io/lamsa/components/alert)
- A decision the reader must make now: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `show(message, options?)` | `number` |  | Shows a toast and returns its id. |
| `options.tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Icon and colour. Danger is announced at once. |
| `options.title` | `string` |  | A few words in bold before the message. |
| `options.duration` | `number` | `6000` | Milliseconds; 0 keeps it. With an action it defaults to 0. |
| `options.action` | `{ label, run }` |  | One button; pressing it closes the toast. |
| `dismiss(id)` | `void` |  | Closes a toast. |
| `labels` | `signal` | `{ region: 'Notifications', close: 'Dismiss' }` | The region name and close button name, translated. |

## Examples

### Tones

Danger is announced at once; the others wait for the screen reader to finish.

```html
toast.show('Address saved', { tone: 'success' });
toast.show('The card was declined. Try another card.', { tone: 'danger', title: 'Payment failed' });
```

### With an action

It stays until it is closed or its button is pressed.

```html
toast.show('Order 1042 deleted', {
  action: { label: 'Undo', run: () => restore(order) },
});
```

### In Arabic

```html
toast.labels.set({ region: 'الإشعارات', close: 'إخفاء' });
toast.show('العنوان اتحفظ', { tone: 'success' });
```
