# Phone field

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A phone number with its country code. The number reads left to right in every language, Arabic digits are welcome, and the 0 people type before a mobile number out of habit is dropped. What the form gets is one international number, ready to send a text to.

Docs: https://ghazal-ui.github.io/ghazal/components/phone-field

```ts
import { PhoneFieldComponent, PHONE_COUNTRIES } from '@ghazal-ui/angular';
// The value is an E.164 number such as +201012345678, or null.
```

When to use something else:

- Any other number: [Number field](https://ghazal-ui.github.io/ghazal/components/number-field)
- A one-time code sent by SMS: [PIN input](https://ghazal-ui.github.io/ghazal/components/pin-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the number. |
| `country` | `string` | `EG` | The country picked at first, by ISO code. A stored number picks its own. |
| `countries` | `PhoneCountry[]` | `PHONE_COUNTRIES` | { code, dial, name }. ISO alpha-2 code supplies a flag. The Arab world first, then the most common elsewhere. |
| `countryLabel` | `string` | `Country code from labels` | Names the list for screen readers. Translate it. |
| `hint \| error \| placeholder` | `string` |  | Help text, the translated error, an example. |

Keyboard and screen readers:

- Up or Down: On the country button, open the list of countries.
- Up or Down or Home or End: In the list, move through the countries.
- Enter or Space: Pick the country.
- Escape or Tab: Close the list.
- The country button is read with the country and its code; the number reads left to right in every language.

## Examples

### A mobile number

Type 010 1234 5678 and the form gets +201012345678.

```html
<ui-phone-field label="Mobile" country="EG" hint="We text the delivery code here." formControlName="phone" />
```

### Your own list

Pass the countries you serve, with their names in the reader's language.

```html
<ui-phone-field label="رقم الجوال" country="SA" countryLabel="رمز الدولة" [countries]="gulf" />

gulf: PhoneCountry[] = [
  { code: 'SA', dial: '+966', name: 'السعودية' },
  { code: 'AE', dial: '+971', name: 'الإمارات' },
];
```
