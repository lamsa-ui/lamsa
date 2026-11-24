# Menu

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short list of actions that opens from a button, such as the actions on a row. Enter, Space or the down arrow open it, the arrow keys and typing move through it, and Escape closes it and puts focus back on the button. For choosing a value, use a select.

Docs: https://lamsa-ui.github.io/lamsa/components/menu

```tsx
import { Menu } from '@lamsa-ui/react';
```

When to use something else:

- The same actions on right-click or a long press: [Context menu](https://lamsa-ui.github.io/lamsa/components/context-menu)
- Pick a value that a form sends: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Links that go to other pages: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Two or three actions that fit on screen: [Button group](https://lamsa-ui.github.io/lamsa/components/button-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `ReactNode` |  | Required. The button's content. |
| `aria-label` | `string` |  | The button's name, when its content is an icon. |
| `items` | `MenuAction[]` |  | Required. { id, label, danger?, disabled? }. |
| `onAction` | `(id: string) => void` |  | Required. Called with the chosen action's id. |
| `variant` | `ButtonVariant` | `'secondary'` | The button's look. |

Keyboard and screen readers:

- Enter or Space or Down: Open the menu from its button.
- Up or Down: Move through the actions.
- Letters: Jump to the action that starts with them.
- Enter or Space: Run the action.
- Escape: Close it, and put focus back on the button.
- Read as a menu of items; the button says it opens a menu.

## Examples

### Row actions

```tsx
<Menu
  label="Actions"
  items={[
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'archive', label: 'Archive', disabled: true },
    { id: 'delete', label: 'Delete', danger: true },
  ]}
  onAction={(id) => run(id)}
/>
```

### In Arabic

```tsx
<Menu label="إجراءات" items={[{ id: 'edit', label: 'تعديل' }]} onAction={run} />
```
