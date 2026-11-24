# Accordion

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A stack of sections that open and close, such as questions and answers. Built on the native details element, so it opens with Enter and Space, works without script, and the browser's find-in-page opens the section that holds the match. Sections grow and shrink smoothly both ways, Up and Down move between the headings, and the chevron mirrors in Arabic.

Docs: https://lamsa-ui.github.io/lamsa/components/accordion

```tsx
import { Accordion, AccordionItem } from '@lamsa-ui/react';
```

When to use something else:

- Switch between views of the same thing, one at a time: [Tabs](https://lamsa-ui.github.io/lamsa/components/tabs)
- Hide one optional detail behind a button: [Popover](https://lamsa-ui.github.io/lamsa/components/popover)
- Show steps the reader must go through in order: [Stepper](https://lamsa-ui.github.io/lamsa/components/stepper)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `single` | `boolean` | `false` | On Accordion: one section open at a time. |
| `icon` | `'end' \| 'start' \| 'none'` | `'end'` | On Accordion, or one AccordionItem: where the chevron sits. |
| `heading` | `ReactNode` |  | Required, on AccordionItem: what opens it. |
| `description` | `ReactNode` |  | On AccordionItem: a quieter line under the heading. |
| `open, defaultOpen` | `boolean` |  | On AccordionItem: controlled, or open at first. Closing runs its motion. |
| `disabled` | `boolean` | `false` | On AccordionItem: focusable and announced, but it does not open. |
| `lazy` | `boolean` | `false` | On AccordionItem: mounts the children when it opens. |
| `keep` | `boolean` | `false` | On AccordionItem: keeps lazy children once mounted. Off, they unmount once closed. |
| `...props` | `details props` |  | On AccordionItem: onToggle and the rest. |

Keyboard and screen readers:

- Enter or Space: Open or close the section.
- Up or Down: Move to the previous or next heading, wrapping round.
- Home or End: Go to the first or last heading.
- Native details elements: they open without script, and find in page opens the section that holds the match.
- In plain HTML only the Up, Down, Home and End keys need script.

## Examples

### Questions

single keeps one section open at a time.

```tsx
<Accordion single>
  <AccordionItem heading="Can I change my order?" defaultOpen>
    <p>Yes, until it ships. Open the order and choose Edit.</p>
  </AccordionItem>
  <AccordionItem heading="How do refunds work?">
    <p>Send the item back within 14 days.</p>
  </AccordionItem>
</Accordion>
```

### Chevron at the start

As in a tree: it points to where the text reads on, and turns down to open. A description adds a quieter line.

```tsx
<Accordion icon="start">
  <AccordionItem heading="Shipping address" description="12 Tahrir Street, Cairo">
    <p>Change it until the order ships.</p>
  </AccordionItem>
</Accordion>
```

### Lazy, kept and disabled

Lazy content is created when its section opens, such as a list that loads from an API, and goes once it has closed, so each open loads it again. keep holds on to it instead. A disabled section stays focusable and announced.

```tsx
<Accordion>
  <AccordionItem heading="Invoices" lazy>
    <Invoices />
  </AccordionItem>
  <AccordionItem heading="History" lazy keep>
    <History />
  </AccordionItem>
  <AccordionItem heading="Archived orders" disabled>…</AccordionItem>
</Accordion>
```

### In Arabic

```tsx
<Accordion single>
  <AccordionItem heading="أقدر أغيّر طلبي؟" defaultOpen>…</AccordionItem>
  <AccordionItem heading="الاسترجاع بيتم إزاي؟">…</AccordionItem>
</Accordion>
```

### In Arabic, chevron at the start

It points left, where Arabic reads on, and turns down to open.

```tsx
<Accordion icon="start">
  <AccordionItem heading="عنوان الشحن" description="١٢ شارع التحرير، القاهرة">…</AccordionItem>
  <AccordionItem heading="الدفع" description="فيزا آخرها ٤٢٤٢">…</AccordionItem>
</Accordion>
```
