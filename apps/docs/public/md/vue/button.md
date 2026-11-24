# Button

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Styles the native button, so it keeps everything the browser gives a button: focus, Enter and Space, form submit. Nine variants, three sizes, icons, and hover, press and focus feedback.

Docs: https://lamsa-ui.github.io/lamsa/components/button

```ts
import { Button } from '@lamsa-ui/vue';
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
| `#startIcon / endIcon` | `slot` |  | Icon before or after the label. The spinner replaces startIcon while loading. |
| `iconOnly` | `boolean` | `false` | Square button for a lone icon. Add an aria-label. |

Keyboard and screen readers:

- Enter or Space: Press the button.
- A native button, so its role, focus and form submit come from the browser.
- A button with only an icon needs a label in words for screen readers.

## Examples

### Variants

One primary action per screen. Danger is for actions that destroy something.

```vue
<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Approve</Button>
<Button variant="warning">Review</Button>
<Button variant="outline">Edit</Button>
<Button variant="soft">Details</Button>
<Button variant="link">Learn more</Button>
```

### Icons

Icons before or after the label are hidden from screen readers. An icon-only button needs an aria-label.

```vue
<Button>
  <template #startIcon><Icon name="plus" /></template>
  New file
</Button>
<Button variant="secondary">
  Next
  <template #endIcon><Icon name="arrow-right" /></template>
</Button>
<Button variant="outline" iconOnly aria-label="Search">
  <Icon name="search" />
</Button>
```

### Sizes

Even the small size stays 44 pixels high, the smallest comfortable touch target.

```vue
<Button size="sm">Small</Button>
<Button>Medium</Button>
<Button size="lg">Large</Button>
```

### Loading

Disables the button, marks it busy for screen readers and shows a spinner.

```vue
<Button :loading="saving" @click="save">
  Save changes
</Button>
```

### Disabled

```vue
<Button disabled>Save</Button>
```

### In Arabic

```vue
<!-- dir="rtl" on the page or any ancestor -->
<Button>حفظ</Button>
<Button variant="secondary">إلغاء</Button>
```
