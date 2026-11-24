# Timeline

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A chronological record of decisions and updates. Each event can show who acted, when it happened, and the outcome, so a case's approval history is easy to scan.

Docs: https://lamsa-ui.github.io/lamsa/components/timeline

```tsx
import { Timeline } from '@lamsa-ui/react';
```

When to use something else:

- Steps still to do: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)
- Many records to sort and filter: [Data table](https://lamsa-ui.github.io/lamsa/components/data-table)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the ordered history list. |
| `items` | `TimelineItem[]` |  | Required. Events in chronological order. |
| `TimelineItem` | `{ title, date, dateTime?, actor?, description?, status?, statusLabel? }` |  | Event details. dateTime is a machine-readable value for the semantic time element. |
| `status` | `'approved' \| 'pending' \| 'rejected'` |  | Adds a status icon and tone label to the event. |
| `statusLabel` | `string` |  | Overrides the default status text, including for translation. |
| `className` | `string` |  | Added to the ordered list. |

## Examples

### Case approval history

A manager approved the request, finance is reviewing it, and the owner is notified once the final decision is made.

```tsx
<Timeline label="Approval history for case 1042" items={[
  { title: 'Request submitted', actor: 'Ibrahim Mohamed', date: '18 Nov 2026, 09:14' },
  { title: 'Manager approval', actor: 'Mohamed Hatem', date: '18 Nov 2026, 11:42',
    status: 'approved', description: 'Approved within the department travel budget.' },
  { title: 'Finance review', actor: 'Finance team', date: 'In progress', status: 'pending' },
]} />
```

### In Arabic

```tsx
<Timeline label="سجل الموافقات" items={[
  { title: 'موافقة المدير', date: '١٨ نوفمبر ٢٠٢٦، ١١:٤٢',
    status: 'approved', statusLabel: 'تمت الموافقة' },
]} />
```
