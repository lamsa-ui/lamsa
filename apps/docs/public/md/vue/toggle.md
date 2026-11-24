# Toggle

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A button that stays pressed until it is pressed again. The label stays the same; screen readers hear 'pressed' or 'not pressed', and the look changes in fill and border, not colour alone.

Docs: https://lamsa-ui.github.io/lamsa/components/toggle

```ts
import { Toggle } from '@lamsa-ui/vue';
```

When to use something else:

- A setting that takes effect at once, such as notifications: [Switch](https://lamsa-ui.github.io/lamsa/components/switch)
- One of several views, such as grid or list: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)
- An action that happens once, such as Save: [Button](https://lamsa-ui.github.io/lamsa/components/button)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `v-model:pressed` | `boolean` |  | Pressed or not. Without it the toggle keeps its own state. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and text size, as on Button. |
| `iconOnly` | `boolean` | `false` | Square, for an icon alone. Give it an aria-label. |
| `disabled` | `boolean` | `false` | Cannot be pressed. |

Keyboard and screen readers:

- Enter or Space: Press it, or let it go.
- Read as a toggle button, pressed or not pressed; the label never changes.

## Examples

### With a label

Pressed is shown by the fill and a thicker border.

```vue
<Toggle v-model:pressed="pinned">
  <Icon name="bookmark" />
  Pin order
</Toggle>
```

### Icon only

With no words on it, the aria-label names it.

```vue
<Toggle v-model:pressed="liked" icon-only aria-label="Favourite">
  <Icon name="star" />
</Toggle>
```

### In Arabic

```vue
<Toggle>تثبيت الطلب</Toggle>
```
