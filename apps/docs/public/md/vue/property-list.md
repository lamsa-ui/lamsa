# Property list

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Label and value pairs, such as the details of one order. Built on the native description list, so screen readers say how many items there are and pair each label with its value.

Docs: https://ghazal-ui.github.io/ghazal/components/property-list

```ts
import { Property, PropertyList } from '@ghazal-ui/vue';
```

When to use something else:

- Many records with the same fields: [Data table](https://ghazal-ui.github.io/ghazal/components/data-table)
- One headline number: [Stat](https://ghazal-ui.github.io/ghazal/components/stat)
- Values the reader edits: [Text field and the other form fields](https://ghazal-ui.github.io/ghazal/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `layout` | `'columns' \| 'stacked'` | `'columns'` | On PropertyList. Stacked puts each label above its value at any width. |
| `term` | `string` |  | On Property, required: the label. Its slot is the value. |

Keyboard and screen readers:

- The native description list, so each label is paired with its value.

## Examples

### Order details

Two columns when there is room. Make the box narrow and each label goes above its value.

```vue
<PropertyList>
  <Property term="Order">#1042</Property>
  <Property term="Status"><Badge variant="success">Paid</Badge></Property>
  <Property term="Customer">Hatem Mohamed</Property>
  <Property term="Delivery">14 Tahrir Street, Dokki, Giza</Property>
  <Property term="Total">EGP 370</Property>
</PropertyList>
```

### Stacked, in Arabic

```vue
<PropertyList layout="stacked">
  <Property term="الطلب">١٠٤٢</Property>
  <Property term="الإجمالي">٣٧٠ جنيه</Property>
</PropertyList>
```
