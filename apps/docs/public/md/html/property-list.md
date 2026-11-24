# Property list

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Label and value pairs, such as the details of one order. Built on the native description list, so screen readers say how many items there are and pair each label with its value.

Docs: https://ghazal-ui.github.io/ghazal/components/property-list

```html
<dl class="ui-property-list">…</dl>
```

When to use something else:

- Many records with the same fields: [Data table](https://ghazal-ui.github.io/ghazal/components/data-table)
- One headline number: [Stat](https://ghazal-ui.github.io/ghazal/components/stat)
- Values the reader edits: [Text field and the other form fields](https://ghazal-ui.github.io/ghazal/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-property-list` | `class` |  | On a dl. Add --stacked for labels above values. |
| `ui-property-list__item` | `class` |  | A div holding one dt and one dd. |

Keyboard and screen readers:

- The native description list, so each label is paired with its value.

## Examples

### Order details

Two columns when there is room. Make the box narrow and each label goes above its value.

```html
<dl class="ui-property-list">
  <div class="ui-property-list__item"><dt>Order</dt><dd>#1042</dd></div>
  <div class="ui-property-list__item">
    <dt>Status</dt><dd><span class="ui-badge ui-badge--success">Paid</span></dd>
  </div>
  <div class="ui-property-list__item"><dt>Total</dt><dd>EGP 370</dd></div>
</dl>
```

### Stacked, in Arabic

```html
<dl class="ui-property-list ui-property-list--stacked">
  <div class="ui-property-list__item"><dt>الطلب</dt><dd>١٠٤٢</dd></div>
</dl>
```
