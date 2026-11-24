# Phone field

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A phone number with its country code. The number reads left to right in every language, Arabic digits are welcome, and the 0 people type before a mobile number out of habit is dropped. What the form gets is one international number, ready to send a text to.

Docs: https://lamsa-ui.github.io/lamsa/components/phone-field

```html
<div class="ui-field ui-phone-field">...</div>
```

When to use something else:

- Any other number: [Number field](https://lamsa-ui.github.io/lamsa/components/number-field)
- A one-time code sent by SMS: [PIN input](https://lamsa-ui.github.io/lamsa/components/pin-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-phone-field` | `class` |  | On the field: the box reads left to right. |
| `ui-phone-field__country` | `class` |  | A country-picker trigger inside the box. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Up or Down: On the country button, open the list of countries.
- Up or Down or Home or End: In the list, move through the countries.
- Enter or Space: Pick the country.
- Escape or Tab: Close the list.
- The country button is read with the country and its code; the number reads left to right in every language.

## Examples

### A mobile number

Type 010 1234 5678 and the form gets +201012345678.

```html
<div class="ui-field ui-phone-field">
  <label class="ui-field__label" for="phone">Mobile</label>
  <div class="ui-input-group">
    <button class="ui-phone-field__country" aria-label="Country code: Egypt +20"
      aria-haspopup="listbox" aria-expanded="false"><span class="ui-phone-field__flag" aria-hidden="true">🇪🇬</span> Egypt +20</button>
    <input class="ui-input-group__input" id="phone" type="tel" inputmode="tel"
      autocomplete="tel-national" />
  </div>
  <!-- The country choices open in a popover listbox. -->
  <ul class="ui-listbox ui-phone-field__listbox" role="listbox" aria-label="Country code">
    <li class="ui-option" role="option" aria-selected="true"><span class="ui-phone-field__flag" aria-hidden="true">🇪🇬</span> Egypt +20</li>
    <li class="ui-option" role="option"><span class="ui-phone-field__flag" aria-hidden="true">🇸🇦</span> Saudi Arabia +966</li>
  </ul>
</div>
```

### Your own list

Pass the countries you serve, with their names in the reader's language.

```html
<!-- The box stays left to right inside an Arabic page; the label does not. -->
```
