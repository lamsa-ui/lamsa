# PIN input

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A code sent by text message, one box per digit. Typing moves along, Backspace goes back, and pasting the code fills every box. On a phone the keyboard offers the code from the message, and the boxes take it all at once.

Docs: https://lamsa-ui.github.io/lamsa/components/pin-input

```ts
import { PinInput } from '@lamsa-ui/vue';
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
| `v-model` | `string` |  | The code typed so far. |
| `@complete` | `event` |  | Fires with the code once every box is filled. |
| `name` | `string` |  | Adds a hidden input with the whole code, for forms. |

## Examples

### A verification code

complete fires once the last box is filled, so the code can be checked without a button.

```vue
<PinInput label="Verification code" @complete="verify" />
```

### A PIN

secret shows dots, for a number the person chose rather than one sent to them.

```vue
<PinInput label="Card PIN" :length="4" secret />
```

### In Arabic

The boxes still run left to right, as the digits do.

```vue
<PinInput label="رمز التحقق" :cellLabel="cell" error="الرمز غير صحيح. أعد المحاولة." />
```
