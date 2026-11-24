# Button

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Styles the native button, so it keeps everything the browser gives a button: focus, Enter and Space, form submit. Nine variants, three sizes, icons, and hover, press and focus feedback.

Docs: https://lamsa-ui.github.io/lamsa/components/button

```ts
import { ButtonComponent } from '@lamsa-ui/angular';
```

When to use something else:

- Go to another page: A link (a href)
- A state that stays on or off, such as bold: [Toggle](https://lamsa-ui.github.io/lamsa/components/toggle)
- Several actions that belong together: [Button group](https://lamsa-ui.github.io/lamsa/components/button-group)
- More actions than fit, behind one button: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'outline' \| 'soft' \| 'link' \| 'success' \| 'warning'` | `'primary'` | How much the button stands out. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding and text size. Height never drops under 44 pixels. |
| `loading` | `boolean` | `false` | Disables the button, sets aria-busy and shows a spinner. |
| `iconOnly` | `boolean` | `false` | Square button for a lone icon. Add an aria-label. |
| `[ui-button-start] / [ui-button-end]` | `content slot` |  | Put an icon before or after the label. Hidden while loading (start). |
| `disabled` | `boolean` | `false` | Disables the button. |

## Examples

### Variants

One primary action per screen. Danger is for actions that destroy something.

```html
<button ui-button>Save</button>
<button ui-button variant="secondary">Cancel</button>
<button ui-button variant="ghost">Skip</button>
<button ui-button variant="danger">Delete</button>
<button ui-button variant="success">Approve</button>
<button ui-button variant="warning">Review</button>
<button ui-button variant="outline">Edit</button>
<button ui-button variant="soft">Details</button>
<button ui-button variant="link">Learn more</button>
```

### Icons

Icons before or after the label are hidden from screen readers. An icon-only button needs an aria-label.

```html
<button ui-button>
  <ui-icon ui-button-start name="plus" />
  New file
</button>
<button ui-button variant="secondary">
  Next
  <ui-icon ui-button-end name="arrow-right" />
</button>
<button ui-button variant="outline" iconOnly aria-label="Search">
  <ui-icon name="search" />
</button>
```

### Sizes

Even the small size stays 44 pixels high, the smallest comfortable touch target.

```html
<button ui-button size="sm">Small</button>
<button ui-button>Medium</button>
<button ui-button size="lg">Large</button>
```

### Loading

Disables the button, marks it busy for screen readers and shows a spinner.

```html
<button ui-button [loading]="saving()" (click)="save()">Save changes</button>
```

### Disabled

```html
<button ui-button disabled>Save</button>
```

### In Arabic

```html
<!-- dir="rtl" on the page or any ancestor -->
<button ui-button>حفظ</button>
<button ui-button variant="secondary">إلغاء</button>
```
