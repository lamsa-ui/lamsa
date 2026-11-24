# Search field

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A box to search with: a magnifier, the text, and a × to clear it. Escape clears it too, and Enter searches. A real search input, so phones show a Search key and screen readers say search.

Docs: https://lamsa-ui.github.io/lamsa/components/search-field

```tsx
import { SearchField } from '@lamsa-ui/react';
```

When to use something else:

- Search the whole app and run commands: [Command palette](https://lamsa-ui.github.io/lamsa/components/command-palette)
- Pick one value from a list as you type: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the field. |
| `hideLabel` | `boolean` | `false` | Keeps the label for screen readers only. |
| `placeholder \| hint` | `string` |  | An example inside the box; help text under it. |
| `clearLabel` | `string` | `Clear search` | Names the × button. Translate it. |
| `value \| defaultValue \| onChange` | `string` |  | Controlled or starting text. |
| `onSearch` | `(value: string) => void` |  | Enter was pressed. |
| `disabled \| name` | `boolean \| string` |  | Passed to the input. |

Keyboard and screen readers:

- Enter: Search.
- Escape: Clear the text.
- A real search input, read as search; the clear button is named.

## Examples

### Search a list

The label can be hidden where the page already says what is searched, as in a header. Screen readers still read it.

```tsx
<SearchField
  label="Search orders"
  hideLabel
  placeholder="Order number or customer"
  value={q}
  onChange={setQ}
  onSearch={find}
/>
```

### With a visible label

In a form or a filter panel, keep the label in view.

```tsx
<SearchField label="Find a branch" hint="Type a city or a street." />
```

### In Arabic

```tsx
<!-- React Aria translates the × button's name from the I18nProvider locale. -->
<SearchField label="ابحث في الطلبات" placeholder="رقم الطلب أو اسم العميل" />
```
