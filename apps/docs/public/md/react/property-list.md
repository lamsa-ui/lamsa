# Property list

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Label and value pairs, such as the details of one order. Built on the native description list, so screen readers say how many items there are and pair each label with its value.

Docs: https://lamsa-ui.github.io/lamsa/components/property-list

```tsx
import { Property, PropertyList } from '@lamsa-ui/react';
```

When to use something else:

- Many records with the same fields: [Data table](https://lamsa-ui.github.io/lamsa/components/data-table)
- One headline number: [Stat](https://lamsa-ui.github.io/lamsa/components/stat)
- Values the reader edits: [Text field and the other form fields](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `layout` | `'columns' \| 'stacked'` | `'columns'` | On PropertyList. Stacked puts each label above its value at any width. |
| `term` | `string` |  | On Property, required: the label. Its children are the value. |

## Examples

### Order details

Two columns when there is room. Make the box narrow and each label goes above its value.

```tsx
<PropertyList>
  <Property term="Order">#1042</Property>
  <Property term="Status"><Badge variant="success">Paid</Badge></Property>
  <Property term="Customer">Mona Adel</Property>
  <Property term="Delivery">14 Tahrir Street, Dokki, Giza</Property>
  <Property term="Total">EGP 370</Property>
</PropertyList>
```

### Stacked, in Arabic

```tsx
<PropertyList layout="stacked">
  <Property term="الطلب">١٠٤٢</Property>
  <Property term="الإجمالي">٣٧٠ جنيه</Property>
</PropertyList>
```
