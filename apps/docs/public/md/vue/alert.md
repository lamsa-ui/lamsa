# Alert

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A message in the page, such as a problem with the whole form or a notice about the account. The title says what it is in words; the icon's shape and the colour repeat it. For a note after an action, use a toast; for a question that needs an answer, an alert dialog.

Docs: https://lamsa-ui.github.io/lamsa/components/alert

```ts
import { Alert } from '@lamsa-ui/vue';
```

When to use something else:

- Confirm an action that just finished: [Toast](https://lamsa-ui.github.io/lamsa/components/toast)
- Stop the reader until they decide: [Alert dialog](https://lamsa-ui.github.io/lamsa/components/alert-dialog)
- Show a status in a row or a card: [Badge](https://lamsa-ui.github.io/lamsa/components/badge)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Icon and colour. The title must say it too. |
| `title` | `string` |  | A few words in bold that say what it is. |
| `#actions` | `slot` |  | Buttons under the message. |
| `@dismiss` | `event` |  | Listening shows a close button; remove the alert when it fires. |
| `closeLabel` | `string` | `'Dismiss'` | Its accessible name, translated. |

Keyboard and screen readers:

- The title says what it is in words; the icon and the colour only repeat it.

## Examples

### Tones

Body text passes 7:1 on every tone, in both themes.

```vue
<Alert title="New: export to PDF">Reports can now be saved as PDF from the menu.</Alert>
<Alert tone="success" title="Payment received">Invoice 1042 is paid.</Alert>
<Alert tone="warning" title="Your plan ends on 1 December">Renew it to keep your reports.</Alert>
<Alert tone="danger" title="The form has 2 problems">Fix the fields marked below.</Alert>
```

### With actions, and closable

Close removes it from the page; the button's name says what it does.

```vue
<Alert
  v-if="shown"
  tone="warning"
  title="Your plan ends on 1 December"
  @dismiss="shown = false"
>
  Renew it to keep your reports.
  <template #actions><Button size="sm">Renew</Button></template>
</Alert>
```

### In Arabic

```vue
<Alert tone="success" title="الدفع وصل">الفاتورة ١٠٤٢ اتدفعت.</Alert>
```
