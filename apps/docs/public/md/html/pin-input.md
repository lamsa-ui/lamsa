# PIN input

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A code sent by text message, one box per digit. Typing moves along, Backspace goes back, and pasting the code fills every box. On a phone the keyboard offers the code from the message, and the boxes take it all at once.

Docs: https://lamsa-ui.github.io/lamsa/components/pin-input

```html
<div class="ui-field">
  <span class="ui-field__label" id="code-label">Verification code</span>
  <div class="ui-pin" role="group" aria-labelledby="code-label">...</div>
</div>
```

When to use something else:

- A password: [Text field with type password](https://lamsa-ui.github.io/lamsa/components/text-field)
- A phone number: [Phone field](https://lamsa-ui.github.io/lamsa/components/phone-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-pin` | `class` |  | The row of boxes, a named group. Always left to right. |
| `ui-pin__cell` | `class` |  | With ui-input, one box. placeholder=" " lets a filled box show darker. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- A digit: Fill the box and move to the next one.
- Backspace: In an empty box, go back to the one before.
- Left or Right: Move to the box before or after.
- Home or End: Go to the first or last box.
- Pasting the code fills every box, and phones offer the code from the message.

## Examples

### A verification code

complete fires once the last box is filled, so the code can be checked without a button.

```html
<div class="ui-field">
  <span class="ui-field__label" id="code-label">Verification code</span>
  <div class="ui-pin" role="group" aria-labelledby="code-label">
    <input class="ui-input ui-pin__cell" inputmode="numeric" placeholder=" "
      autocomplete="one-time-code" aria-label="Digit 1 of 6" />
    <input class="ui-input ui-pin__cell" inputmode="numeric" placeholder=" "
      autocomplete="off" aria-label="Digit 2 of 6" />
    <!-- … one per digit; a script moves focus as each is typed -->
  </div>
</div>
```

### A PIN

secret shows dots, for a number the person chose rather than one sent to them.

```html
<input class="ui-input ui-pin__cell" type="password" inputmode="numeric" … />
```

### In Arabic

The boxes still run left to right, as the digits do.

```html
<!-- .ui-pin keeps left to right inside an Arabic page. -->
```
