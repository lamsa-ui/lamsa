# Search field

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A box to search with: a magnifier, the text, and a × to clear it. Escape clears it too, and Enter searches. A real search input, so phones show a Search key and screen readers say search.

Docs: https://lamsa-ui.github.io/lamsa/components/search-field

```ts
import { SearchField } from '@lamsa-ui/vue';
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
| `v-model` | `string` |  | The text typed so far. |
| `@search` | `event` |  | Enter was pressed; gets the text. |
| `disabled \| name` | `boolean \| string` |  | As on any input. |

Keyboard and screen readers:

- Enter: Search.
- Escape: Clear the text.
- A real search input, read as search; the clear button is named.

## Examples

### Search a list

The label can be hidden where the page already says what is searched, as in a header. Screen readers still read it.

```vue
<SearchField
  label="Search orders"
  hideLabel
  placeholder="Order number or customer"
  v-model="q"
  @search="find"
/>
```

### With a visible label

In a form or a filter panel, keep the label in view.

```vue
<SearchField label="Find a branch" hint="Type a city or a street." />
```

### In Arabic

```vue
<!-- React Aria translates the × button's name from the I18nProvider locale. -->
<SearchField label="ابحث في الطلبات" placeholder="رقم الطلب أو اسم العميل" />
```
