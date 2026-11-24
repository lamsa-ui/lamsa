# Card

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A surface that groups related content: a summary, a list, a form. Cards are flat, with a thin border; shadows are kept for things that float, like menus and dialogs.

Docs: https://lamsa-ui.github.io/lamsa/components/card

```tsx
import { Card } from '@lamsa-ui/react';
```

When to use something else:

- Separate two groups with a line only: [Divider](https://lamsa-ui.github.io/lamsa/components/divider)
- Label and value pairs, such as order details: [Property list](https://lamsa-ui.github.io/lamsa/components/property-list)
- One number and how it changed: [Stat](https://lamsa-ui.github.io/lamsa/components/stat)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `title` | `string` |  | Optional heading at the top of the card. |
| `level` | `2 \| 3 \| 4` | `3` | The heading level of the title. |
| `padding` | `'md' \| 'lg'` | `'md'` | 1.5rem or 2rem inside the border. |
| `...props` | `div props` |  | Every native div prop: id, aria-label, ref. |

Keyboard and screen readers:

- A card with a heading reads as its own part of the page; give it one when it stands alone.

## Examples

### With a title

Set the heading level so the title fits the page: level 2 under the page title, level 3 inside a section.

```tsx
<Card title="Order #1042">
  <p>2 items · 340 EGP</p>
  <Badge variant="success">Paid</Badge>
</Card>
```

### Roomy

More padding, for a card that stands alone on a page.

```tsx
<Card title="Today" padding="lg" level={2}>
  <p>18 orders, 3 still in the kitchen.</p>
</Card>
```

### In Arabic

```tsx
<Card title="طلب رقم ١٠٤٢">
  <p>صنفين · ٣٤٠ جنيه</p>
</Card>
```
