# Phone field

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A phone number with its country code. The number reads left to right in every language, Arabic digits are welcome, and the 0 people type before a mobile number out of habit is dropped. What the form gets is one international number, ready to send a text to.

Docs: https://lamsa-ui.github.io/lamsa/components/phone-field

```ts
import { PhoneField, PHONE_COUNTRIES } from '@lamsa-ui/vue';
// Bind one E.164 number with v-model, or null when empty.
```

When to use something else:

- Any other number: [Number field](https://lamsa-ui.github.io/lamsa/components/number-field)
- A one-time code sent by SMS: [PIN input](https://lamsa-ui.github.io/lamsa/components/pin-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the number. |
| `country` | `string` | `EG` | The country picked at first, by ISO code. A stored number picks its own. |
| `countries` | `PhoneCountry[]` | `PHONE_COUNTRIES` | { code, dial, name }. ISO alpha-2 code supplies a flag. The Arab world first, then the most common elsewhere. |
| `countryLabel` | `string` | `Country code` | Names the list for screen readers. Translate it. |
| `hint \| error \| placeholder` | `string` |  | Help text, the translated error, an example. |
| `modelValue \| update:modelValue` | `string \| null` |  | The v-model number, controlled as E.164. |
| `name` | `string` |  | Submits the whole number with a form. |

Keyboard and screen readers:

- Up or Down: On the country button, open the list of countries.
- Up or Down or Home or End: In the list, move through the countries.
- Enter or Space: Pick the country.
- Escape or Tab: Close the list.
- The country button is read with the country and its code; the number reads left to right in every language.

## Examples

### A mobile number

Type 010 1234 5678 and the form gets +201012345678.

```vue
<PhoneField v-model="phone" label="Mobile" country="EG"
  hint="We text the delivery code here." />
```

### Your own list

Pass the countries you serve, with their names in the reader's language.

```vue
<PhoneField v-model="phone" label="رقم الجوال" country="SA"
  country-label="رمز الدولة" :countries="gulf" />
```
