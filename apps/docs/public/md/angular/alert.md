# Alert

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A message in the page, such as a problem with the whole form or a notice about the account. The title says what it is in words; the icon's shape and the colour repeat it. For a note after an action, use a toast; for a question that needs an answer, an alert dialog.

Docs: https://lamsa-ui.github.io/lamsa/components/alert

```ts
import { AlertComponent } from '@lamsa-ui/angular';
// Not announced on page load. Shown after an action? Add role="alert" or role="status".
```

When to use something else:

- Confirm an action that just finished: [Toast](https://lamsa-ui.github.io/lamsa/components/toast)
- Stop the reader until they decide: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)
- Show a status in a row or a card: [Badge](https://lamsa-ui.github.io/lamsa/components/badge)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Icon and colour. The title must say it too. |
| `title` | `string` |  | A few words in bold that say what it is. |
| `dismissible` | `boolean` | `false` | Shows a close button. |
| `closeLabel` | `string` | `'Dismiss'` | Its accessible name, translated. |
| `(dismiss)` | `void` |  | The close button was pressed: remove the alert. |
| `[ui-alert-actions]` | `slot` |  | An element holding buttons, under the message. |

## Examples

### Tones

Body text passes 7:1 on every tone, in both themes.

```html
<ui-alert title="New: export to PDF">Reports can now be saved as PDF from the menu.</ui-alert>
<ui-alert tone="success" title="Payment received">Invoice 1042 is paid.</ui-alert>
<ui-alert tone="warning" title="Your plan ends on 1 December">Renew it to keep your reports.</ui-alert>
<ui-alert tone="danger" title="The form has 2 problems">Fix the fields marked below.</ui-alert>
```

### With actions, and closable

Close removes it from the page; the button's name says what it does.

```html
<ui-alert
  tone="warning"
  title="Your plan ends on 1 December"
  [dismissible]="true"
  closeLabel="Dismiss"
  (dismiss)="shown.set(false)"
>
  Renew it to keep your reports.
  <div ui-alert-actions>
    <button ui-button size="sm">Renew</button>
    <button ui-button size="sm" variant="secondary">See plans</button>
  </div>
</ui-alert>
```

### In Arabic

```html
<ui-alert tone="success" title="الدفع وصل" closeLabel="إخفاء">الفاتورة ١٠٤٢ اتدفعت.</ui-alert>
```
