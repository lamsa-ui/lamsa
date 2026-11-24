# Progress

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

How far a long task has got, such as an upload. The native progress bar, named by its label, with the amount in words beside it. Without a value it shows a moving band: work is going on but its length is not known.

Docs: https://lamsa-ui.github.io/lamsa/components/progress

```ts
import { ProgressComponent } from '@lamsa-ui/angular';
```

When to use something else:

- A level that is not work being done, such as storage used: [Meter](https://lamsa-ui.github.io/lamsa/components/meter)
- Waiting with no idea how long: [Spinner](https://lamsa-ui.github.io/lamsa/components/spinner)
- Steps the reader goes through: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the bar. |
| `value` | `number \| null` |  | How much is done. Leave it out when unknown. |
| `max` | `number` | `100` | The value when done. |
| `valueText` | `string` |  | The amount in words; defaults to a percentage. |
| `testId` | `string` |  | data-testid on the progress element. |

## Examples

### Known amount

```html
<ui-progress label="Uploading invoice.pdf" [value]="sent()" />
<ui-progress label="Importing contacts" [value]="3" [max]="5" valueText="3 of 5 files" />
```

### Unknown amount

```html
<ui-progress label="Preparing the report" />
```

### In Arabic

```html
<ui-progress label="بنرفع الفاتورة" [value]="64" />
```
