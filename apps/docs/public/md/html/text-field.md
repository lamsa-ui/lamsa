# Text field

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Label, input, hint and error as one control. The label, hint and error are tied to the input, so screen readers read all three.

Docs: https://ghazal-ui.github.io/ghazal/components/text-field

```html
<div class="ui-field">
  <label class="ui-field__label" for="email">Email</label>
  <input class="ui-input" id="email" type="email" />
</div>
```

When to use something else:

- Several lines of text: [Textarea](https://ghazal-ui.github.io/ghazal/components/textarea)
- A unit or currency beside the value: [Input group](https://ghazal-ui.github.io/ghazal/components/input-group)
- A number with − and + buttons: [Number field](https://ghazal-ui.github.io/ghazal/components/number-field)
- Search with a clear button: [Search field](https://ghazal-ui.github.io/ghazal/components/search-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-field` | `class` |  | The wrapper: stacks label, input, hint and error. |
| `ui-field__label` | `class` |  | On the label; its for matches the input id. |
| `ui-input` | `class` |  | On the input (also works on a native select). |
| `ui-field__hint` | `class` |  | Help text; list its id in the input aria-describedby. |
| `ui-field__error` | `class` |  | The error, with role="alert"; set aria-invalid="true" on the input and list the error id in aria-describedby. |

Keyboard and screen readers:

- The label, hint and error are tied to the input, so all three are read.
- An error is announced when it appears.

## Examples

### With a hint

```html
<div class="ui-field">
  <label class="ui-field__label" for="email">Email</label>
  <input class="ui-input" id="email" type="email" autocomplete="email" aria-describedby="email-hint" />
  <p class="ui-field__hint" id="email-hint">We only use it for order updates.</p>
</div>
```

### With an error

Pass the translated message. The input gets aria-invalid, a thicker border, and the message is announced. Colour is never the only sign.

```html
<div class="ui-field">
  <label class="ui-field__label" for="name">Full name</label>
  <input class="ui-input" id="name" aria-invalid="true" aria-describedby="name-error" />
  <p class="ui-field__error" id="name-error" role="alert">Enter your full name</p>
</div>
```

### Disabled

Disable it through the form control, as with any input.

```html
<div class="ui-field">
  <label class="ui-field__label" for="order">Order number</label>
  <input class="ui-input" id="order" value="ORD-1042" disabled />
</div>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<div class="ui-field">
  <label class="ui-field__label" for="email">البريد الإلكتروني</label>
  <input class="ui-input" id="email" type="email" aria-describedby="email-hint" />
  <p class="ui-field__hint" id="email-hint">بنستخدمه لتحديثات الطلب بس.</p>
</div>
```
