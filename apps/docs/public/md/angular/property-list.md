# Property list

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Label and value pairs, such as the details of one order. Built on the native description list, so screen readers say how many items there are and pair each label with its value.

Docs: https://ghazal-ui.github.io/ghazal/components/property-list

```ts
import { PropertyComponent, PropertyListComponent } from '@ghazal-ui/angular';
```

When to use something else:

- Many records with the same fields: [Data table](https://ghazal-ui.github.io/ghazal/components/data-table)
- One headline number: [Stat](https://ghazal-ui.github.io/ghazal/components/stat)
- Values the reader edits: [Text field and the other form fields](https://ghazal-ui.github.io/ghazal/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `layout` | `'columns' \| 'stacked'` | `'columns'` | On dl[ui-property-list]. Stacked puts each label above its value at any width. |
| `term` | `string` |  | On div[ui-property], required: the label. Its content is the value. |

Keyboard and screen readers:

- The native description list, so each label is paired with its value.

## Examples

### Order details

Two columns when there is room. Make the box narrow and each label goes above its value.

```html
<dl ui-property-list>
  <div ui-property term="Order">#1042</div>
  <div ui-property term="Status"><ui-badge variant="success">Paid</ui-badge></div>
  <div ui-property term="Customer">Hatem Mohamed</div>
  <div ui-property term="Delivery">14 Tahrir Street, Dokki, Giza</div>
  <div ui-property term="Total">EGP 370</div>
</dl>
```

### Stacked, in Arabic

```html
<dl ui-property-list layout="stacked">
  <div ui-property term="الطلب">١٠٤٢</div>
  <div ui-property term="الإجمالي">٣٧٠ جنيه</div>
</dl>
```
