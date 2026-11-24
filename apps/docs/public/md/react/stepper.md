# Stepper

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A flow split into steps, such as checkout. Each step holds its own content, and the stepper shows the current one with Back and Next under it. The step names are buttons, so people can go back. Done steps have a tick and are read as Done, the current one is announced as the current step, and focus moves to the new step's content after each change.

Docs: https://lamsa-ui.github.io/lamsa/components/stepper

```tsx
import { Stepper } from '@lamsa-ui/react';
```

When to use something else:

- Views the reader can open in any order: [Tabs](https://lamsa-ui.github.io/lamsa/components/tabs)
- Pages of a list: [Pagination](https://lamsa-ui.github.io/lamsa/components/pagination)
- What happened to a request, in time order: [Timeline](https://lamsa-ui.github.io/lamsa/components/timeline)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the list of steps: "Checkout". |
| `linear` | `boolean` | `false` | Each step waits for the ones before it to be completed, and Next waits for the current one. |
| `doneLabel` | `string` | `'Done'` | Read before each done step. Translate it. |
| `backLabel \| nextLabel \| finishLabel` | `string` | `'Back' \| 'Next' \| 'Finish'` | The button labels. Translate them. |
| `number` | `(n: number) => string` | `String` | The marker's number, for Arabic digits. |
| `steps` | `{ label, content, completed? }[]` |  | Required. Each step stays mounted while hidden, so what was typed is kept. completed defaults to true. |
| `current \| defaultCurrent` | `number` | `0` | Index of the current step, controlled or not. |
| `onChange` | `(index: number) => void` |  | The current step changed. |
| `onBlocked` | `(index: number) => void` |  | Linear only: Next or Finish was pressed on this step while it is not completed. |
| `onFinish` | `() => void` |  | Finish was pressed on the last step. |

Keyboard and screen readers:

- Tab: Reach the step names, Back and Next.
- Done steps are read as Done and the current one as the current step.
- Focus moves to the new step’s content after each change.

## Examples

### Options

Turn linear on, then try to reach a later step before filling in the current one.

```tsx
<Stepper label="Checkout" linear={linear}
  steps={[
    { label: 'Step 1', content: …, completed: done1 },
    { label: 'Step 2', content: …, completed: done2 },
  ]} />
```

### At any screen width

The same stepper in a box as wide as the slider says. It reads its own box, not the window.

```tsx
<Stepper label="Checkout" linear={linear}
  steps={[
    { label: 'Step 1', content: …, completed: done1 },
    { label: 'Step 2', content: …, completed: done2 },
  ]} />
```

### Checkout, in order

A whole flow. The address and card steps are completed once their fields are valid; press Next with them empty to see the errors. Finish places the order.

```tsx
<Stepper
  label="Checkout"
  linear
  onBlocked={() => setTouched(true)}
  onFinish={placeOrder}
  steps={[
    { label: 'Cart', content: <Cart /> },
    { label: 'Address', content: <Address />, completed: name !== '' },
    { label: 'Payment', content: <Payment /> },
    { label: 'Review', content: <Review /> },
  ]}
/>
```

### In Arabic

Without linear, every step can be chosen. Translate the button labels and Done.

```tsx
<Stepper label="إتمام الطلب" doneLabel="تم"
  backLabel="السابق" nextLabel="التالي" finishLabel="إنهاء"
  number={(n) => n.toLocaleString('ar-EG')}
  defaultCurrent={2}
  steps={[
    { label: 'السلة', content: … },
    { label: 'العنوان', content: … },
    { label: 'الدفع', content: … },
    { label: 'المراجعة', content: … },
  ]} />
```
