# Input group

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A text field with fixed text inside its box, before or after the value: a currency, a unit, a domain. The text is read with the field, so 'Price, EGP' is heard, but it is never part of the value.

Docs: https://ghazal-ui.github.io/ghazal/components/input-group

```html
<div class="ui-input-group">…<input class="ui-input-group__input" />…</div>
```

When to use something else:

- A number with − and + buttons: [Number field](https://ghazal-ui.github.io/ghazal/components/number-field)
- A phone number with its country code: [Phone field](https://ghazal-ui.github.io/ghazal/components/phone-field)
- A search box with a clear button: [Search field](https://ghazal-ui.github.io/ghazal/components/search-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-input-group` | `class` |  | The box around the input and its text. |
| `ui-input-group__input` | `class` |  | The input. aria-describedby points at the addons so they are read. |
| `ui-input-group__addon` | `class` |  | Text before the input; add --end for text after it. |

Keyboard and screen readers:

- The text before or after the value is read with the field, such as Price, EGP, but is never part of the value.

## Examples

### Before and after

Set prefix or suffix on a text field.

```html
<div class="ui-field">
  <label class="ui-field__label" for="price">Price</label>
  <div class="ui-input-group">
    <span class="ui-input-group__addon" id="price-prefix">EGP</span>
    <input class="ui-input-group__input" id="price" type="number" aria-describedby="price-prefix" />
  </div>
</div>
<div class="ui-field">
  <label class="ui-field__label" for="weight">Weight</label>
  <div class="ui-input-group">
    <input class="ui-input-group__input" id="weight" type="number" aria-describedby="weight-suffix" />
    <span class="ui-input-group__addon ui-input-group__addon--end" id="weight-suffix">kg</span>
  </div>
</div>
```

### In Arabic

```html
<div class="ui-input-group">
  <input class="ui-input-group__input" id="price" type="number" aria-describedby="price-suffix" />
  <span class="ui-input-group__addon ui-input-group__addon--end" id="price-suffix">جنيه</span>
</div>
```
