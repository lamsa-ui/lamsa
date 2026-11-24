# PIN input

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A code sent by text message, one box per digit. Typing moves along, Backspace goes back, and pasting the code fills every box. On a phone the keyboard offers the code from the message, and the boxes take it all at once.

Docs: https://lamsa-ui.github.io/lamsa/components/pin-input

```ts
import { PinInputComponent } from '@lamsa-ui/angular';
// The value is the digits typed so far, as one string.
```

When to use something else:

- A password: [Text field with type password](https://lamsa-ui.github.io/lamsa/components/text-field)
- A phone number: [Phone field](https://lamsa-ui.github.io/lamsa/components/phone-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the boxes as a group. |
| `length` | `number` | `6` | How many digits. |
| `secret` | `boolean` | `false` | Dots instead of digits, for a PIN. |
| `cellLabel` | `(n, of) => string` | ``Digit ${n} of ${of}` from labels` | Each box's name for screen readers. Translate it. |
| `hint \| error` | `string` |  | Help text, and the translated error that marks it invalid. |
| `(complete)` | `string` |  | Every box is filled: the whole code. |

Keyboard and screen readers:

- A digit: Fill the box and move to the next one.
- Backspace: In an empty box, go back to the one before.
- Left or Right: Move to the box before or after.
- Home or End: Go to the first or last box.
- Pasting the code fills every box, and phones offer the code from the message.

## Examples

### A verification code

complete fires once the last box is filled, so the code can be checked without a button.

```html
<ui-pin-input label="Verification code" formControlName="code" (complete)="verify($event)" />
```

### A PIN

secret shows dots, for a number the person chose rather than one sent to them.

```html
<ui-pin-input label="Card PIN" [length]="4" secret />
```

### In Arabic

The boxes still run left to right, as the digits do.

```html
<ui-pin-input label="رمز التحقق" [cellLabel]="cell" error="الرمز غير صحيح. أعد المحاولة." />

cell = (n: number, of: number) => `الرقم ${n.toLocaleString('ar-EG')} من ${of.toLocaleString('ar-EG')}`;
```
