# Checkbox

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A yes or no that is saved with the form, such as accepting the terms. The native checkbox in the primary colour; the whole label is the hit area, at least 44px tall.

Docs: https://lamsa-ui.github.io/lamsa/components/checkbox

```html
<label class="ui-check">
  <input type="checkbox" name="updates" />
  Email me about my orders
</label>
```

When to use something else:

- One choice from a few options: [Radio group](https://lamsa-ui.github.io/lamsa/components/radio-group)
- A setting that takes effect at once: [Switch](https://lamsa-ui.github.io/lamsa/components/switch)
- Several choices from a long list: [Combobox or Chip input](https://lamsa-ui.github.io/lamsa/components/chip-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-check` | `class` |  | On the label that wraps the input and its text. |
| `ui-field, ui-field--invalid` | `class` |  | A wrapper when there is a hint or an error; list their ids in aria-describedby. |

## Examples

### With a hint

```html
<div class="ui-field">
  <label class="ui-check">
    <input type="checkbox" id="updates" aria-describedby="updates-hint" />
    Email me about my orders
  </label>
  <p class="ui-field__hint" id="updates-hint">One email per order, no adverts.</p>
</div>
```

### With an error

The message is announced and tied to the checkbox, so a screen reader hears why the form did not send.

```html
<div class="ui-field ui-field--invalid">
  <label class="ui-check">
    <input type="checkbox" id="terms" aria-invalid="true" aria-describedby="terms-error" />
    I accept the terms
  </label>
  <p class="ui-field__error" id="terms-error" role="alert">Accept the terms to continue</p>
</div>
```

### Some of a list

indeterminate shows a dash on a parent checkbox when only some items under it are ticked.

```html
<label class="ui-check">
  <input type="checkbox" id="all" />
  All files
</label>
<script>document.getElementById('all').indeterminate = true;</script>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<label class="ui-check">
  <input type="checkbox" />
  ابعتلي إيميل عن طلباتي
</label>
```
