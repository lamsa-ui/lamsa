# Fieldset

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A titled group of fields inside a longer form. Screen readers read the legend as they enter the group, so a field called Street is heard as part of the delivery address.

Docs: https://lamsa-ui.github.io/lamsa/components/fieldset

```html
<fieldset class="ui-fieldset">
  <legend class="ui-fieldset__legend">Delivery address</legend>
  …fields
</fieldset>
```

When to use something else:

- A frame around content that is not a form: [Card](https://lamsa-ui.github.io/lamsa/components/card)
- One choice from a few, with a group label: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-fieldset` | `class` |  | On the fieldset; spaces the fields in it. |
| `ui-fieldset__legend` | `class` |  | On its legend. |

## Examples

### An address

```html
<fieldset class="ui-fieldset" aria-describedby="address-hint">
  <legend class="ui-fieldset__legend">Delivery address</legend>
  <p class="ui-field__hint" id="address-hint">Where the driver should go.</p>
  <div class="ui-field">…Street</div>
  <div class="ui-field">…City</div>
</fieldset>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor; the markup is the same -->
```
