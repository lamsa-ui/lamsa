# Context menu

Framework: React. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Actions that open where the reader right-clicks, long-presses, or presses Shift+F10 on the focused item. It is a shortcut: the same actions must also be somewhere visible, because touch and keyboard users rarely look for one.

Docs: https://ghazal-ui.github.io/ghazal/components/context-menu

```tsx
import { ContextMenu } from '@ghazal-ui/react';
```

When to use something else:

- The visible way to the same actions: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)
- Actions that should always be on screen: [Toolbar](https://ghazal-ui.github.io/ghazal/components/toolbar)
- Search every command in the app: [Command palette](https://ghazal-ui.github.io/ghazal/components/command-palette)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `items` | `MenuAction[]` |  | Required. { id, label, danger?, disabled? } for each action. |
| `onAction` | `(id: string) => void` |  | Called with the chosen action's id; the menu then closes. |
| `disabled` | `boolean` | `false` | Right-click shows the browser menu instead. |
| `children` | `ReactNode` |  | The area that opens the menu. Make it focusable. |

Keyboard and screen readers:

- Shift + F10 or Menu: Open the menu on the focused item.
- Up or Down: Move through the actions.
- Enter or Space: Run the action.
- Escape: Close it.
- It is a shortcut: the same actions must also be somewhere visible.

## Examples

### On a file

Right-click the file, or Tab to it and press Shift+F10.

```tsx
<ContextMenu
  items={[
    { id: 'rename', label: 'Rename' },
    { id: 'copy', label: 'Make a copy' },
    { id: 'delete', label: 'Delete', danger: true },
  ]}
  onAction={run}
>
  <div tabIndex={0}>invoice-1042.pdf</div>
</ContextMenu>
```
