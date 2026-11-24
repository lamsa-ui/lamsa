# Stepper

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A flow split into steps, such as checkout. Each step holds its own content, and the stepper shows the current one with Back and Next under it. The step names are buttons, so people can go back. Done steps have a tick and are read as Done, the current one is announced as the current step, and focus moves to the new step's content after each change.

Docs: https://lamsa-ui.github.io/lamsa/components/stepper

```ts
import { StepComponent, StepperComponent } from '@lamsa-ui/angular';
```

When to use something else:

- Views the reader can open in any order: [Tabs](https://lamsa-ui.github.io/lamsa/components/tabs)
- Pages of a list: [Pagination](https://lamsa-ui.github.io/lamsa/components/pagination)
- What happened to a request, in time order: [Timeline](https://lamsa-ui.github.io/lamsa/components/timeline)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the list of steps: "Checkout". |
| `linear` | `boolean` | `false` | Each step waits for the ones before it to be completed, and Next waits for the current one. |
| `doneLabel` | `string` | `'Done' from labels` | Read before each done step. Translate it. |
| `backLabel \| nextLabel \| finishLabel` | `string` | `'Back' \| 'Next' \| 'Finish' from labels` | The button labels. Translate them. |
| `number` | `(n: number) => string` | `String` | The marker's number, for Arabic digits. |
| `current` | `number` | `0` | Index of the current step; two-way with [(current)]. |
| `(blocked)` | `number` |  | Linear only: Next or Finish was pressed on this step while it is not completed. Show its errors. |
| `(finish)` | `void` |  | Finish was pressed on the last step. |
| `ui-step label` | `string` |  | Required. The step's name; its content goes inside. |
| `ui-step completed` | `boolean` | `true` | Whether the step is filled in, such as its form being valid. A step before the current one shows a tick only when it is. |

Keyboard and screen readers:

- Tab: Reach the step names, Back and Next.
- Done steps are read as Done and the current one as the current step.
- Focus moves to the new step’s content after each change.

## Examples

### Options

Turn linear on, then try to reach a later step before filling in the current one.

```html
<ui-stepper label="Checkout" [linear]="linear" [(current)]="step">
  <ui-step label="Step 1" [completed]="done1">…</ui-step>
  <ui-step label="Step 2" [completed]="done2">…</ui-step>
</ui-stepper>
```

### At any screen width

The same stepper in a box as wide as the slider says. It reads its own box, not the window.

```html
<ui-stepper label="Checkout" [linear]="linear" [(current)]="step">
  <ui-step label="Step 1" [completed]="done1">…</ui-step>
  <ui-step label="Step 2" [completed]="done2">…</ui-step>
</ui-stepper>
```

### Checkout, in order

A whole flow. The address and card steps are completed once their fields are valid; press Next with them empty to see the errors. Finish places the order.

```html
<ui-stepper label="Checkout" linear
  [(current)]="step"
  (blocked)="showErrors($event)"
  (finish)="placeOrder()">
  <ui-step label="Cart">…</ui-step>
  <ui-step label="Address" [completed]="address.valid">
    <ui-text-field label="Full name" formControlName="name"
      [error]="name.invalid && name.touched ? 'Enter your full name' : undefined" />
    <ui-text-field label="Email" type="email" formControlName="email" />
  </ui-step>
  <ui-step label="Payment" [completed]="card.valid">
    <ui-text-field label="Card number" [formControl]="card" />
  </ui-step>
  <ui-step label="Review">…</ui-step>
</ui-stepper>
```

### In Arabic

Without linear, every step can be chosen. Translate the button labels and Done.

```html
<ui-stepper label="إتمام الطلب" doneLabel="تم"
  backLabel="السابق" nextLabel="التالي" finishLabel="إنهاء"
  [number]="arabicDigits" [current]="2">
  <ui-step label="السلة">…</ui-step>
  <ui-step label="العنوان">…</ui-step>
  <ui-step label="الدفع">…</ui-step>
  <ui-step label="المراجعة">…</ui-step>
</ui-stepper>

arabicDigits = (n: number) => n.toLocaleString('ar-EG');
```
