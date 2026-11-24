# Stat

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

One number with its label, and how it changed. The change is written out, with its sign or in words; the arrow and the colour only repeat it.

Docs: https://lamsa-ui.github.io/lamsa/components/stat

```ts
import { StatComponent } from '@lamsa-ui/angular';
```

When to use something else:

- A level against a limit, such as 70% of storage: [Meter](https://lamsa-ui.github.io/lamsa/components/meter)
- Several label and value pairs: [Property list](https://lamsa-ui.github.io/lamsa/components/property-list)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. What the number counts. |
| `value` | `string` |  | Required. The number, already formatted with its unit. |
| `change` | `string` |  | How it changed, readable on its own: "+12% on last month". |
| `trend` | `'up' \| 'down' \| 'flat'` |  | The arrow beside the change. |
| `tone` | `'positive' \| 'negative' \| 'neutral'` | `'neutral'` | Green, red or grey for the change. Set it by meaning, not by direction. |

## Examples

### A row of stats

Tone is set apart from the arrow, because up is not always good: rising costs go up in red.

```html
<div class="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
  <ui-card>
    <ui-stat label="Revenue" value="EGP 84,200"
      change="+12% on last month" trend="up" tone="positive" />
  </ui-card>
  <ui-card>
    <ui-stat label="Costs" value="EGP 31,900"
      change="+8% on last month" trend="up" tone="negative" />
  </ui-card>
  <ui-card>
    <ui-stat label="Orders" value="1,204"
      change="Same as last month" trend="flat" />
  </ui-card>
</div>
```

### Number only

```html
<ui-stat label="Open tickets" value="7" />
```

### In Arabic

```html
<ui-stat label="الإيرادات" value="٨٤٬٢٠٠ جنيه"
  change="+١٢٪ عن الشهر الماضي" trend="up" tone="positive" />
```
