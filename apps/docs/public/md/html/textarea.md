# Textarea

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

The multi-line twin of the text field: the same label, hint and error, with room for a few lines. The reader can make it taller.

Docs: https://lamsa-ui.github.io/lamsa/components/textarea

```html
<div class="ui-field">
  <label class="ui-field__label" for="notes">Delivery notes</label>
  <textarea class="ui-input" id="notes" rows="4"></textarea>
</div>
```

When to use something else:

- One line of text: [Text field](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `textarea.ui-input` | `element + class` |  | Inside a ui-field, with a label as for the text field. |
| `ui-field__hint, ui-field__error` | `class` |  | As for the text field: list their ids in aria-describedby; set aria-invalid="true" with an error. |

Keyboard and screen readers:

- The same label, hint and error as the text field, all read with it.

## Examples

### With a hint

```html
<div class="ui-field">
  <label class="ui-field__label" for="notes">Delivery notes</label>
  <textarea class="ui-input" id="notes" rows="4" aria-describedby="notes-hint"></textarea>
  <p class="ui-field__hint" id="notes-hint">Gate code, floor, anything the driver should know.</p>
</div>
```

### With an error

Same rules as the text field: the message is announced, and the border thickens, so colour is never the only sign.

```html
<div class="ui-field">
  <label class="ui-field__label" for="reason">Reason for the refund</label>
  <textarea class="ui-input" id="reason" aria-invalid="true" aria-describedby="reason-error"></textarea>
  <p class="ui-field__error" id="reason-error" role="alert">Tell us what went wrong</p>
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<div class="ui-field">
  <label class="ui-field__label" for="notes">ملاحظات التوصيل</label>
  <textarea class="ui-input" id="notes" aria-describedby="notes-hint"></textarea>
  <p class="ui-field__hint" id="notes-hint">كود البوابة، الدور، أي حاجة السواق محتاج يعرفها.</p>
</div>
```
