# Checkbox

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A yes or no that is saved with the form, such as accepting the terms. The native checkbox in the primary colour; the whole label is the hit area, at least 44px tall.

Docs: https://ghazal-ui.github.io/ghazal/components/checkbox

```tsx
import { Checkbox } from '@ghazal-ui/react';
// Every other prop goes to the input: checked, onChange, name, ref.
```

When to use something else:

- One choice from a few options: [Radio group](https://ghazal-ui.github.io/ghazal/components/radio-group)
- A setting that takes effect at once: [Switch](https://ghazal-ui.github.io/ghazal/components/switch)
- Several choices from a long list: [Combobox or Chip input](https://ghazal-ui.github.io/ghazal/components/chip-input)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. The visible label. |
| `hint` | `string` |  | Help text, read with the checkbox. |
| `error` | `string` |  | The translated error. Marks it invalid and announces the message. |
| `indeterminate` | `boolean` | `false` | Shows a dash: some of the items under it are ticked. |
| `testId` | `string` |  | data-testid on the input. |
| `...props` | `input props` |  | Every native input prop: checked, defaultChecked, onChange, name, ref. |

Keyboard and screen readers:

- Space: Tick or untick it.
- The native checkbox, named by its label; the whole label is the hit area.

## Examples

### With a hint

```tsx
<Checkbox
  label="Email me about my orders"
  hint="One email per order, no adverts."
  checked={updates}
  onChange={(e) => setUpdates(e.target.checked)}
/>
```

### With an error

The message is announced and tied to the checkbox, so a screen reader hears why the form did not send.

```tsx
<Checkbox
  label="I accept the terms"
  checked={terms}
  onChange={(e) => setTerms(e.target.checked)}
  error={terms ? undefined : 'Accept the terms to continue'}
/>
```

### Some of a list

indeterminate shows a dash on a parent checkbox when only some items under it are ticked.

```tsx
<Checkbox label="All files" indeterminate={some} checked={all} onChange={toggleAll} />
```

### In Arabic

```tsx
{/* dir="rtl" on the page or any ancestor */}
<Checkbox label="ابعتلي إيميل عن طلباتي" />
```
