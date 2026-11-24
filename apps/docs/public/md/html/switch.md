# Switch

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

An on or off setting that takes effect at once, with no save button. Screen readers say on and off, and the knob's side shows the state, so it never depends on colour. For a choice saved with a form, use a checkbox.

Docs: https://lamsa-ui.github.io/lamsa/components/switch

```html
<label class="ui-switch">
  Order updates
  <input type="checkbox" role="switch" class="ui-switch__input" />
</label>
```

When to use something else:

- A choice sent with a form: [Checkbox](https://lamsa-ui.github.io/lamsa/components/checkbox)
- A pressed state in a toolbar, such as bold: [Toggle](https://lamsa-ui.github.io/lamsa/components/toggle)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-switch` | `class` |  | On the label: the text, then the input. |
| `ui-switch__input` | `class` |  | On an input type="checkbox" with role="switch". |

## Examples

### Settings

```html
<div class="ui-field">
  <label class="ui-switch">
    Order updates
    <input type="checkbox" role="switch" class="ui-switch__input" aria-describedby="updates-hint" checked />
  </label>
  <p class="ui-field__hint" id="updates-hint">A message to your phone when the driver is near.</p>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor: the knob moves the other way -->
<label class="ui-switch">
  تحديثات الطلب
  <input type="checkbox" role="switch" class="ui-switch__input" />
</label>
```
