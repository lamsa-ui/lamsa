# Stat

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

One number with its label, and how it changed. The change is written out, with its sign or in words; the arrow and the colour only repeat it.

Docs: https://lamsa-ui.github.io/lamsa/components/stat

```html
<div class="ui-stat">...</div>
```

When to use something else:

- A level against a limit, such as 70% of storage: [Meter](https://lamsa-ui.github.io/lamsa/components/meter)
- Several label and value pairs: [Property list](https://lamsa-ui.github.io/lamsa/components/property-list)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-stat` | `class` |  | Required. Label, value and change stack in that order, which is also the reading order. |
| `ui-stat__label \| __value \| __change` | `class` |  | The three lines. |
| `ui-stat__change--positive \| --negative` | `class` |  | The colour of the change. Put aria-hidden on its arrow. |

Keyboard and screen readers:

- The change is written out, with its sign or in words; the arrow and colour only repeat it.

## Examples

### A row of stats

Tone is set apart from the arrow, because up is not always good: rising costs go up in red.

```html
<div class="ui-card">
  <div class="ui-stat">
    <p class="ui-stat__label">Revenue</p>
    <p class="ui-stat__value">EGP 84,200</p>
    <p class="ui-stat__change ui-stat__change--positive">
      <i class="ui-icon ui-icon-arrow-up" aria-hidden="true"></i>
      +12% on last month
    </p>
  </div>
</div>
```

### Number only

```html
<div class="ui-stat">
  <p class="ui-stat__label">Open tickets</p>
  <p class="ui-stat__value">7</p>
</div>
```

### In Arabic

```html
<div class="ui-stat">
  <p class="ui-stat__label">الإيرادات</p>
  <p class="ui-stat__value">٨٤٬٢٠٠ جنيه</p>
  <p class="ui-stat__change ui-stat__change--positive">+١٢٪ عن الشهر الماضي</p>
</div>
```
