# Property list

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Label and value pairs, such as the details of one order. Built on the native description list, so screen readers say how many items there are and pair each label with its value.

Docs: https://lamsa-ui.github.io/lamsa/components/property-list

```ts
import { PropertyComponent, PropertyListComponent } from '@lamsa-ui/angular';
```

When to use something else:

- Many records with the same fields: [Data table](https://lamsa-ui.github.io/lamsa/components/data-table)
- One headline number: [Stat](https://lamsa-ui.github.io/lamsa/components/stat)
- Values the reader edits: [Text field and the other form fields](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `layout` | `'columns' \| 'stacked'` | `'columns'` | On dl[ui-property-list]. Stacked puts each label above its value at any width. |
| `term` | `string` |  | On div[ui-property], required: the label. Its content is the value. |

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
