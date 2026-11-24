# Toggle

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A button that stays pressed until it is pressed again. The label stays the same; screen readers hear 'pressed' or 'not pressed', and the look changes in fill and border, not colour alone.

Docs: https://lamsa-ui.github.io/lamsa/components/toggle

```ts
import { ToggleComponent } from '@lamsa-ui/angular';
```

When to use something else:

- A setting that takes effect at once, such as notifications: [Switch](https://lamsa-ui.github.io/lamsa/components/switch)
- One of several views, such as grid or list: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)
- An action that happens once, such as Save: [Button](https://lamsa-ui.github.io/lamsa/components/button)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `[(pressed)]` | `boolean` | `false` | Pressed or not, two-way. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and text size, as on Button. |
| `iconOnly` | `boolean` | `false` | Square, for an icon alone. Give it an aria-label. |
| `disabled` | `boolean` | `false` | Cannot be pressed. |

Keyboard and screen readers:

- Enter or Space: Press it, or let it go.
- Read as a toggle button, pressed or not pressed; the label never changes.

## Examples

### With a label

Pressed is shown by the fill and a thicker border.

```html
<button ui-toggle [(pressed)]="pinned">
  <ui-icon name="bookmark" ui-button-start />
  Pin order
</button>
```

### Icon only

With no words on it, the aria-label names it.

```html
<button ui-toggle iconOnly aria-label="Favourite" [(pressed)]="liked">
  <ui-icon name="star" />
</button>
```

### In Arabic

```html
<button ui-toggle>تثبيت الطلب</button>
```
