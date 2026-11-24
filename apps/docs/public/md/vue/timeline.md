# Timeline

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A chronological record of decisions and updates. Each event can show who acted, when it happened, and the outcome, so a case's approval history is easy to scan.

Docs: https://ghazal-ui.github.io/ghazal/components/timeline

```ts
import { Timeline } from '@ghazal-ui/vue';
```

When to use something else:

- Steps still to do: [Stepper](https://ghazal-ui.github.io/ghazal/components/stepper)
- Many records to sort and filter: [Data table](https://ghazal-ui.github.io/ghazal/components/data-table)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the ordered history list. |
| `items` | `TimelineItem[]` |  | Required. Events in chronological order. |
| `TimelineItem` | `{ title, date, dateTime?, actor?, description?, status?, statusLabel? }` |  | Event details. dateTime is a machine-readable value for the semantic time element. |
| `TimelineItem.status` | `'approved' \| 'pending' \| 'rejected'` |  | Adds a status icon and tone label to the event. |
| `TimelineItem.statusLabel` | `string` |  | Overrides the default status text, including for translation. |

Keyboard and screen readers:

- An ordered list, so screen readers say how many events there are; each date is a time element.

## Examples

### Case approval history

A manager approved the request, finance is reviewing it, and the owner is notified once the final decision is made.

```vue
<Timeline label="Approval history for case 1042" :items="[
  { title: 'Request submitted', actor: 'Ibrahim Mohamed', date: '18 Nov 2026, 09:14' },
  { title: 'Manager approval', actor: 'Mohamed Hatem', date: '18 Nov 2026, 11:42',
    status: 'approved', description: 'Approved within the department travel budget.' },
  { title: 'Finance review', actor: 'Finance team', date: 'In progress', status: 'pending' },
]" />
```

### In Arabic

```vue
<Timeline label="سجل الموافقات" :items="[
  { title: 'موافقة المدير', date: '١٨ نوفمبر ٢٠٢٦، ١١:٤٢',
    status: 'approved', statusLabel: 'تمت الموافقة' },
]" />
```
