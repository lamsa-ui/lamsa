# Stepper

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A flow split into steps, such as checkout. Each step holds its own content, and the stepper shows the current one with Back and Next under it. The step names are buttons, so people can go back. Done steps have a tick and are read as Done, the current one is announced as the current step, and focus moves to the new step's content after each change.

Docs: https://ghazal-ui.github.io/ghazal/components/stepper

```ts
import { Stepper } from '@ghazal-ui/vue';
```

When to use something else:

- Views the reader can open in any order: [Tabs](https://ghazal-ui.github.io/ghazal/components/tabs)
- Pages of a list: [Pagination](https://ghazal-ui.github.io/ghazal/components/pagination)
- What happened to a request, in time order: [Timeline](https://ghazal-ui.github.io/ghazal/components/timeline)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the list of steps: "Checkout". |
| `linear` | `boolean` | `false` | Each step waits for the ones before it to be completed, and Next waits for the current one. |
| `doneLabel` | `string` | `'Done' from labels` | Read before each done step. Translate it. |
| `backLabel \| nextLabel \| finishLabel` | `string` | `'Back' \| 'Next' \| 'Finish' from labels` | The button labels. Translate them. |
| `number` | `(n: number) => string` | `String` | The marker's number, for Arabic digits. |
| `steps` | `{ label, completed? }[]` |  | Required. completed defaults to true; false keeps a linear stepper on it. |
| `v-model` | `number` | `0` | Index of the current step. |
| `#panel` | `slot` |  | Renders each step from { index, step }. Hidden steps stay mounted, so what was typed is kept. |
| `@blocked` | `event` |  | Linear only: Next or Finish was pressed on a step that is not completed. |
| `@finish` | `event` |  | Finish was pressed on the last step. |

Keyboard and screen readers:

- Tab: Reach the step names, Back and Next.
- Done steps are read as Done and the current one as the current step.
- Focus moves to the new step’s content after each change.

## Examples

### Options

Turn linear on, then try to reach a later step before filling in the current one.

```vue
<Stepper label="Checkout" :linear="linear"
  :steps="[
    { label: 'Step 1', completed: done1 },
    { label: 'Step 2', completed: done2 },
  ]">
  <template #panel="{ index }">…</template>
</Stepper>
```

### At any screen width

The same stepper in a box as wide as the slider says. It reads its own box, not the window.

```vue
<Stepper label="Checkout" :linear="linear"
  :steps="[
    { label: 'Step 1', completed: done1 },
    { label: 'Step 2', completed: done2 },
  ]">
  <template #panel="{ index }">…</template>
</Stepper>
```

### Checkout, in order

A whole flow. The address and card steps are completed once their fields are valid; press Next with them empty to see the errors. Finish places the order.

```vue
<Stepper
  label="Checkout"
  linear
  :steps="[
    { label: 'Cart' },
    { label: 'Address', completed: name !== '' },
    { label: 'Payment' },
    { label: 'Review' },
  ]"
  @blocked="touched = true"
  @finish="placeOrder"
>
  <template #panel="{ index }">
    <Cart v-if="index === 0" />
    <Address v-else-if="index === 1" />
    <Payment v-else-if="index === 2" />
    <Review v-else />
  </template>
</Stepper>
```

### In Arabic

Without linear, every step can be chosen. Translate the button labels and Done.

```vue
<Stepper label="إتمام الطلب" doneLabel="تم"
  backLabel="السابق" nextLabel="التالي" finishLabel="إنهاء"
  :number="(n) => n.toLocaleString('ar-EG')"
  :model-value="2"
  :steps="[{ label: 'السلة' }, { label: 'العنوان' }, { label: 'الدفع' }, { label: 'المراجعة' }]">
  <template #panel="{ index }">…</template>
</Stepper>
```
