# Meter

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A level inside a known range: storage used, a plan's limit, a score. It is not work in progress, that is Progress. The value is written next to the label, so the tone colour only repeats what the words say.

Docs: https://ghazal-ui.github.io/ghazal/components/meter

```ts
import { Meter } from '@ghazal-ui/vue';
```

When to use something else:

- Work that is still going, such as an upload: [Progress](https://ghazal-ui.github.io/ghazal/components/progress)
- One number and how it changed: [Stat](https://ghazal-ui.github.io/ghazal/components/stat)
- A value the reader sets: [Slider](https://ghazal-ui.github.io/ghazal/components/slider)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. What is measured. |
| `value` | `number` |  | Required. The level now, between min and max. |
| `min` | `number` | `0` | The lowest level. |
| `max` | `number` | `100` | The highest level. |
| `valueText` | `string` |  | The value in words, shown and read: "7.2 of 10 GB". Defaults to a percentage. |
| `tone` | `'neutral' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Colour of the fill. You decide it from the value. |

Keyboard and screen readers:

- The native meter, named by its label, with the value in words beside it.

## Examples

### Levels

You choose the tone from the value: the meter does not guess what is good or bad.

```vue
<Meter label="Storage" :value="7.2" :max="10" value-text="7.2 of 10 GB" tone="warning" />
<Meter label="Orders this month" :value="182" :max="500" value-text="182 of 500" />
<Meter label="Delivery score" :value="94" tone="success" />
<Meter label="SMS credit" :value="3" value-text="3 left" tone="danger" />
```

### In Arabic

```vue
<Meter label="المساحة" :value="72" value-text="٧٫٢ من ١٠ جيجابايت" tone="warning" />
```
