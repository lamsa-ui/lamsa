# Select

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

One choice from a list. Arrow keys, Home and End, and typing the first letters all move through the options; Escape and Tab close the list and return focus.

Docs: https://lamsa-ui.github.io/lamsa/components/select

```html
<select class="ui-input" id="city">...</select>
```

When to use something else:

- A long list the reader searches: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)
- Two to five options that fit on screen: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)
- Actions, not values: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `select.ui-input` | `element + class` |  | A native select inside a ui-field, with a label as for the text field. |
| `aria-invalid="true"` | `attribute` |  | With a ui-field__error message listed in aria-describedby. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Enter or Space or Up or Down: Open the list.
- Up or Down or Home or End: Move through the options.
- Letters: Jump to the option that starts with them.
- Enter or Space: Pick the option.
- Escape or Tab: Close the list, and put focus back on the button.
- Read as a list box, with the chosen option and the field’s label.

## Examples

### Basic

```html
<div class="ui-field">
  <label class="ui-field__label" for="city">City</label>
  <select class="ui-input" id="city">
    <option value="">Choose a city</option>
    <option value="cai">Cairo</option>
    <option value="alx">Alexandria</option>
  </select>
</div>
```

### With an error

```html
<div class="ui-field">
  <label class="ui-field__label" for="size">Size</label>
  <select class="ui-input" id="size" aria-invalid="true" aria-describedby="size-error">
    <option value="">Choose a size</option>
    <option value="s">Small</option>
    <option value="m">Medium</option>
    <option value="l" disabled>Large</option>
  </select>
  <p class="ui-field__error" id="size-error" role="alert">Choose a size</p>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<div class="ui-field">
  <label class="ui-field__label" for="city">المدينة</label>
  <select class="ui-input" id="city">
    <option value="cai">القاهرة</option>
    <option value="alx">الإسكندرية</option>
  </select>
</div>
```
