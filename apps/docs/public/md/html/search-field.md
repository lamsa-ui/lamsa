# Search field

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A box to search with: a magnifier, the text, and a × to clear it. Escape clears it too, and Enter searches. A real search input, so phones show a Search key and screen readers say search.

Docs: https://lamsa-ui.github.io/lamsa/components/search-field

```html
<div class="ui-field">
  <label class="ui-field__label ui-visually-hidden" for="q">Search orders</label>
  <div class="ui-input-group">...</div>
</div>
```

When to use something else:

- Search the whole app and run commands: [Command palette](https://lamsa-ui.github.io/lamsa/components/command-palette)
- Pick one value from a list as you type: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-input-group` | `class` |  | The box around the input, icon and button. Rings while the input has focus. |
| `ui-input-group__addon \| __input \| __button` | `class` |  | The magnifier, the input and the × button. |

Keyboard and screen readers:

- Enter: Search.
- Escape: Clear the text.
- A real search input, read as search; the clear button is named.

## Examples

### Search a list

The label can be hidden where the page already says what is searched, as in a header. Screen readers still read it.

```html
<div class="ui-field">
  <label class="ui-field__label ui-visually-hidden" for="q">Search orders</label>
  <div class="ui-input-group">
    <span class="ui-input-group__addon" aria-hidden="true"><i class="ui-icon ui-icon-search"></i></span>
    <input class="ui-input-group__input" id="q" type="search" enterkeyhint="search"
      placeholder="Order number or customer" />
    <!-- Shown once there is text. Escape clears it from the keyboard. -->
    <button type="button" class="ui-input-group__button" tabindex="-1" aria-label="Clear search">
      <i class="ui-icon ui-icon-x"></i>
    </button>
  </div>
</div>
```

### With a visible label

In a form or a filter panel, keep the label in view.

```html
<label class="ui-field__label" for="branch">Find a branch</label>
```

### In Arabic

```html
<!-- dir="rtl" on the page: the magnifier moves to the right on its own. -->
```
