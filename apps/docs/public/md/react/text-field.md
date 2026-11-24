# Text field

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Label, input, hint and error as one control. The label, hint and error are tied to the input, so screen readers read all three.

Docs: https://lamsa-ui.github.io/lamsa/components/text-field

```tsx
import { TextField } from '@lamsa-ui/react';
// Every other prop goes to the input: value, onChange, name, ref,
// so it works with React Hook Form's register() too.
```

When to use something else:

- Several lines of text: [Textarea](https://lamsa-ui.github.io/lamsa/components/textarea)
- A unit or currency beside the value: [Input group](https://lamsa-ui.github.io/lamsa/components/input-group)
- A number with − and + buttons: [Number field](https://lamsa-ui.github.io/lamsa/components/number-field)
- Search with a clear button: [Search field](https://lamsa-ui.github.io/lamsa/components/search-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label, tied to the input. |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url'` | `'text'` | The input type. |
| `hint` | `string` |  | Help text under the input, read with it. |
| `error` | `string` |  | The translated error. Marks the input invalid and announces the message. |
| `testId` | `string` |  | data-testid on the input, for tests. |
| `...props` | `input props` |  | Every native input prop: value, defaultValue, onChange, name, autoComplete, disabled, ref. |

Keyboard and screen readers:

- The label, hint and error are tied to the input, so all three are read.
- An error is announced when it appears.

## Examples

### With a hint

```tsx
<TextField
  label="Email"
  type="email"
  hint="We only use it for order updates."
  autoComplete="email"
  name="email"
/>
```

### With an error

Pass the translated message. The input gets aria-invalid, a thicker border, and the message is announced. Colour is never the only sign.

```tsx
const [name, setName] = useState('');

<TextField
  label="Full name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={name ? undefined : 'Enter your full name'}
/>
```

### Disabled

Disable it through the form control, as with any input.

```tsx
<TextField label="Order number" defaultValue="ORD-1042" disabled />
```

### In Arabic

```tsx
{/* dir="rtl" on the page or any ancestor */}
<TextField label="البريد الإلكتروني" type="email" hint="بنستخدمه لتحديثات الطلب بس." />
```
