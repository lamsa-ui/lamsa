# PIN input

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A code sent by text message, one box per digit. Typing moves along, Backspace goes back, and pasting the code fills every box. On a phone the keyboard offers the code from the message, and the boxes take it all at once.

Docs: https://lamsa-ui.github.io/lamsa/components/pin-input

```tsx
import { PinInput } from '@lamsa-ui/react';
```

When to use something else:

- A password: [Text field with type password](https://lamsa-ui.github.io/lamsa/components/text-field)
- A phone number: [Phone field](https://lamsa-ui.github.io/lamsa/components/phone-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the boxes as a group. |
| `length` | `number` | `6` | How many digits. |
| `secret` | `boolean` | `false` | Dots instead of digits, for a PIN. |
| `cellLabel` | `(n, of) => string` | ``Digit ${n} of ${of}`` | Each box's name for screen readers. Translate it. |
| `hint \| error` | `string` |  | Help text, and the translated error that marks it invalid. |
| `value \| defaultValue \| onChange` | `string` |  | Controlled or starting digits. |
| `onComplete` | `(code: string) => void` |  | Every box is filled. |
| `name` | `string` |  | Submits the code as one value with a form. |

Keyboard and screen readers:

- A digit: Fill the box and move to the next one.
- Backspace: In an empty box, go back to the one before.
- Left or Right: Move to the box before or after.
- Home or End: Go to the first or last box.
- Pasting the code fills every box, and phones offer the code from the message.

## Examples

### A verification code

complete fires once the last box is filled, so the code can be checked without a button.

```tsx
<PinInput label="Verification code" onComplete={verify} />
```

### A PIN

secret shows dots, for a number the person chose rather than one sent to them.

```tsx
<PinInput label="Card PIN" length={4} secret />
```

### In Arabic

The boxes still run left to right, as the digits do.

```tsx
<PinInput label="رمز التحقق" cellLabel={cell} error="الرمز غير صحيح. أعد المحاولة." />
```
