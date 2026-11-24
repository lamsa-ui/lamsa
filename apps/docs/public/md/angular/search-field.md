# Search field

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A box to search with: a magnifier, the text, and a × to clear it. Escape clears it too, and Enter searches. A real search input, so phones show a Search key and screen readers say search.

Docs: https://lamsa-ui.github.io/lamsa/components/search-field

```ts
import { SearchFieldComponent } from '@lamsa-ui/angular';
// The value is the text. Works with formControlName, [formControl] and ngModel.
```

When to use something else:

- Search the whole app and run commands: [Command palette](https://lamsa-ui.github.io/lamsa/components/command-palette)
- Pick one value from a list as you type: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the field. |
| `hideLabel` | `boolean` | `false` | Keeps the label for screen readers only. |
| `placeholder \| hint` | `string` |  | An example inside the box; help text under it. |
| `clearLabel` | `string` | `Clear search from labels` | Names the × button. Translate it. |
| `(submitted)` | `string` |  | Enter was pressed: the text to search for. |

Keyboard and screen readers:

- Enter: Search.
- Escape: Clear the text.
- A real search input, read as search; the clear button is named.

## Examples

### Search a list

The label can be hidden where the page already says what is searched, as in a header. Screen readers still read it.

```html
<ui-search-field
  label="Search orders"
  hideLabel
  placeholder="Order number or customer"
  formControlName="q"
  (submitted)="find($event)"
/>
```

### With a visible label

In a form or a filter panel, keep the label in view.

```html
<ui-search-field label="Find a branch" hint="Type a city or a street." />
```

### In Arabic

```html
<ui-search-field label="ابحث في الطلبات" clearLabel="مسح البحث" placeholder="رقم الطلب أو اسم العميل" />
```
