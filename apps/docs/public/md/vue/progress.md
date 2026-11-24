# Progress

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

How far a long task has got, such as an upload. The native progress bar, named by its label, with the amount in words beside it. Without a value it shows a moving band: work is going on but its length is not known.

Docs: https://ghazal-ui.github.io/ghazal/components/progress

```ts
import { Progress } from '@ghazal-ui/vue';
```

When to use something else:

- A level that is not work being done, such as storage used: [Meter](https://ghazal-ui.github.io/ghazal/components/meter)
- Waiting with no idea how long: [Spinner](https://ghazal-ui.github.io/ghazal/components/spinner)
- Steps the reader goes through: [Stepper](https://ghazal-ui.github.io/ghazal/components/stepper)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the bar. |
| `value` | `number \| null` |  | How much is done. Leave it out when unknown. |
| `max` | `number` | `100` | The value when done. |
| `valueText` | `string` |  | The amount in words; defaults to a percentage. |

Keyboard and screen readers:

- The native progress bar, named by its label, with the amount in words beside it.
- Without a value it shows a moving band: work is going on but its length is not known.

## Examples

### Known amount

```vue
<Progress label="Uploading invoice.pdf" :value="sent" />
<Progress label="Importing contacts" :value="3" :max="5" valueText="3 of 5 files" />
```

### Unknown amount

```vue
<Progress label="Preparing the report" />
```

### In Arabic

```vue
<Progress label="بنرفع الفاتورة" :value="64" />
```
