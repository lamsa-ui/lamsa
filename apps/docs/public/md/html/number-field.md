# Number field

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A number with − and + either side. Type it, in Latin or Arabic digits, or step it with the buttons, the arrow keys, or Page Up and Down for ten steps. On leaving the field it stays inside its limits and is written in the reader's language.

Docs: https://lamsa-ui.github.io/lamsa/components/number-field

```html
<div class="ui-field ui-number-field">...</div>
```

When to use something else:

- A rough amount on a scale: [Slider](https://lamsa-ui.github.io/lamsa/components/slider)
- A code such as an ID or a card number: [Text field](https://lamsa-ui.github.io/lamsa/components/text-field)
- A price with a currency beside it: [Input group](https://lamsa-ui.github.io/lamsa/components/input-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-number-field` | `class` |  | On the field: centres the number between the buttons. |
| `ui-input-group__button` | `class` |  | The − and + buttons, out of the Tab order. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Up or Down: Step up or down by one step.
- Page Up or Page Down: Step by ten steps.
- Home or End: Go to the lowest or highest value, when there is one.
- Enter: Keep the value inside its limits and write it out.
- Latin and Arabic digits are both taken; the − and + buttons are named.

## Examples

### A quantity

The number is the one Tab stop; the buttons are for the pointer, as Up and Down do the same.

```html
<!-- Without a framework, a native number input steps and checks its limits itself. -->
<div class="ui-field ui-number-field">
  <label class="ui-field__label" for="guests">Guests</label>
  <div class="ui-input-group">
    <button type="button" class="ui-input-group__button" tabindex="-1" aria-label="Decrease"
      onclick="guests.stepDown()"><i class="ui-icon ui-icon-minus"></i></button>
    <input class="ui-input-group__input" id="guests" type="number" min="1" max="12" value="2" />
    <button type="button" class="ui-input-group__button" tabindex="-1" aria-label="Increase"
      onclick="guests.stepUp()"><i class="ui-icon ui-icon-plus"></i></button>
  </div>
</div>
```

### Money

formatOptions takes any Intl number format: currency, units, or a fixed number of decimals.

```html
<!-- Show the currency beside the number: -->
<span class="ui-input-group__addon">EGP</span>
```

### In Arabic

```html
<!-- dir="rtl": − sits on the right, + on the left. -->
```
