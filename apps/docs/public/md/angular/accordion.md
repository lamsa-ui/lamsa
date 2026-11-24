# Accordion

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A stack of sections that open and close, such as questions and answers. Built on the native details element, so it opens with Enter and Space, works without script, and the browser's find-in-page opens the section that holds the match. Sections grow and shrink smoothly both ways, Up and Down move between the headings, and the chevron mirrors in Arabic.

Docs: https://ghazal-ui.github.io/ghazal/components/accordion

```ts
import {
  AccordionComponent,
  AccordionContentDirective,
  AccordionItemComponent,
} from '@ghazal-ui/angular';
// Each item is a native <details ui-accordion-item>.
```

When to use something else:

- Switch between views of the same thing, one at a time: [Tabs](https://ghazal-ui.github.io/ghazal/components/tabs)
- Hide one optional detail behind a button: [Popover](https://ghazal-ui.github.io/ghazal/components/popover)
- Show steps the reader must go through in order: [Stepper](https://ghazal-ui.github.io/ghazal/components/stepper)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `single` | `boolean` | `false` | On ui-accordion: one section open at a time. |
| `icon` | `'end' \| 'start' \| 'none'` | `'end'` | On ui-accordion, or one item: where the chevron sits. At the start it points to where the text reads on. |
| `heading` | `string` |  | On each item: the text that opens it. For richer content, an element with uiAccordionHeading. |
| `description` | `string` |  | On each item: a quieter line under the heading. |
| `open, [(open)]` | `boolean` | `false` | On each item: open or not. Closing runs its motion. |
| `disabled` | `boolean` | `false` | On each item: focusable and announced, but it does not open. |
| `ng-template uiAccordionContent` | `directive` |  | Inside an item: content created when it opens. |
| `keep` | `boolean` | `false` | On each item: keeps lazy content once shown. Off, it goes once closed and loads again on the next open. |

Keyboard and screen readers:

- Enter or Space: Open or close the section.
- Up or Down: Move to the previous or next heading, wrapping round.
- Home or End: Go to the first or last heading.
- Native details elements: they open without script, and find in page opens the section that holds the match.
- In plain HTML only the Up, Down, Home and End keys need script.

## Examples

### Questions

single keeps one section open at a time.

```html
<ui-accordion single>
  <details ui-accordion-item heading="Can I change my order?" open>
    <p>Yes, until it ships. Open the order and choose Edit.</p>
  </details>
  <details ui-accordion-item heading="How do refunds work?">
    <p>Send the item back within 14 days.</p>
  </details>
</ui-accordion>
```

### Chevron at the start

As in a tree: it points to where the text reads on, and turns down to open. A description adds a quieter line.

```html
<ui-accordion icon="start">
  <details ui-accordion-item heading="Shipping address" description="12 Tahrir Street, Cairo">
    <p>Change it until the order ships.</p>
  </details>
</ui-accordion>
```

### Lazy, kept and disabled

Lazy content is created when its section opens, such as a list that loads from an API, and goes once it has closed, so each open loads it again. keep holds on to it instead. A disabled section stays focusable and announced.

```html
<ui-accordion>
  <details ui-accordion-item heading="Invoices">
    <ng-template uiAccordionContent><app-invoices /></ng-template>
  </details>
  <details ui-accordion-item heading="History" keep>
    <ng-template uiAccordionContent><app-history /></ng-template>
  </details>
  <details ui-accordion-item heading="Archived orders" disabled>…</details>
</ui-accordion>
```

### In Arabic

```html
<ui-accordion single>
  <details ui-accordion-item heading="أقدر أغيّر طلبي؟" open>…</details>
  <details ui-accordion-item heading="الاسترجاع بيتم إزاي؟">…</details>
</ui-accordion>
```

### In Arabic, chevron at the start

It points left, where Arabic reads on, and turns down to open.

```html
<ui-accordion icon="start">
  <details ui-accordion-item heading="عنوان الشحن" description="١٢ شارع التحرير، القاهرة">…</details>
  <details ui-accordion-item heading="الدفع" description="فيزا آخرها ٤٢٤٢">…</details>
</ui-accordion>
```
