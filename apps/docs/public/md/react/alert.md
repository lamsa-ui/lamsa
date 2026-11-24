# Alert

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A message in the page, such as a problem with the whole form or a notice about the account. The title says what it is in words; the icon's shape and the colour repeat it. For a note after an action, use a toast; for a question that needs an answer, an alert dialog.

Docs: https://lamsa-ui.github.io/lamsa/components/alert

```tsx
import { Alert } from '@lamsa-ui/react';
```

When to use something else:

- Confirm an action that just finished: [Toast](https://lamsa-ui.github.io/lamsa/components/toast)
- Stop the reader until they decide: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)
- Show a status in a row or a card: [Badge](https://lamsa-ui.github.io/lamsa/components/badge)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Icon and colour. The title must say it too. |
| `title` | `string` |  | A few words in bold that say what it is. |
| `actions` | `ReactNode` |  | Buttons under the message. |
| `onDismiss` | `() => void` |  | Shows a close button that calls it. |
| `closeLabel` | `string` | `'Dismiss'` | Its accessible name, translated. |
| `...props` | `div props` |  | Every native div prop, such as role. |

## Examples

### Tones

Body text passes 7:1 on every tone, in both themes.

```tsx
<Alert title="New: export to PDF">Reports can now be saved as PDF from the menu.</Alert>
<Alert tone="success" title="Payment received">Invoice 1042 is paid.</Alert>
<Alert tone="warning" title="Your plan ends on 1 December">Renew it to keep your reports.</Alert>
<Alert tone="danger" title="The form has 2 problems">Fix the fields marked below.</Alert>
```

### With actions, and closable

Close removes it from the page; the button's name says what it does.

```tsx
<Alert
  tone="warning"
  title="Your plan ends on 1 December"
  onDismiss={() => setShown(false)}
  actions={<Button size="sm">Renew</Button>}
>
  Renew it to keep your reports.
</Alert>
```

### In Arabic

```tsx
<Alert tone="success" title="الدفع وصل">الفاتورة ١٠٤٢ اتدفعت.</Alert>
```
