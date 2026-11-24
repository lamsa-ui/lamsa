# Toggle

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A button that stays pressed until it is pressed again. The label stays the same; screen readers hear 'pressed' or 'not pressed', and the look changes in fill and border, not colour alone.

Docs: https://lamsa-ui.github.io/lamsa/components/toggle

```tsx
import { Toggle } from '@lamsa-ui/react';
```

When to use something else:

- A setting that takes effect at once, such as notifications: [Switch](https://lamsa-ui.github.io/lamsa/components/switch)
- One of several views, such as grid or list: [Segmented control](https://lamsa-ui.github.io/lamsa/components/segmented-control)
- An action that happens once, such as Save: [Button](https://lamsa-ui.github.io/lamsa/components/button)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `pressed` | `boolean` |  | Pressed now. Pass it with onPressedChange to control it. |
| `defaultPressed` | `boolean` | `false` | Pressed at first, when the toggle keeps its own state. |
| `onPressedChange` | `(pressed: boolean) => void` |  | Called with the new state on every press. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and text size, as on Button. |
| `iconOnly` | `boolean` | `false` | Square, for an icon alone. Give it an aria-label. |
| `...props` | `button props` |  | Every native button prop, such as disabled. |

## Examples

### With a label

Pressed is shown by the fill and a thicker border.

```tsx
const [pinned, setPinned] = useState(false);

<Toggle pressed={pinned} onPressedChange={setPinned}>
  <Icon name="bookmark" />
  Pin order
</Toggle>
```

### Icon only

With no words on it, the aria-label names it.

```tsx
<Toggle iconOnly aria-label="Favourite" defaultPressed>
  <Icon name="star" />
</Toggle>
```

### In Arabic

```tsx
<Toggle>تثبيت الطلب</Toggle>
```
