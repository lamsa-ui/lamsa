# Context menu

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Actions that open where the reader right-clicks, long-presses, or presses Shift+F10 on the focused item. It is a shortcut: the same actions must also be somewhere visible, because touch and keyboard users rarely look for one.

Docs: https://ghazal-ui.github.io/ghazal/components/context-menu

```ts
import {
  ContextMenuTriggerDirective,
  MenuComponent,
  MenuItemComponent,
} from '@ghazal-ui/angular';
```

When to use something else:

- The visible way to the same actions: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)
- Actions that should always be on screen: [Toolbar](https://ghazal-ui.github.io/ghazal/components/toolbar)
- Search every command in the app: [Command palette](https://ghazal-ui.github.io/ghazal/components/command-palette)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `uiContextMenu` | `TemplateRef` |  | On the area that opens it: an ng-template holding a <ui-menu>. Make the area focusable. |
| `uiContextMenuDisabled` | `boolean` | `false` | Right-click shows the browser menu instead. |
| `<button ui-menu-item>` | `component` |  | One action, as in Menu: (triggered) fires for click, Enter and Space; danger for red text. |

Keyboard and screen readers:

- Shift + F10 or Menu: Open the menu on the focused item.
- Up or Down: Move through the actions.
- Enter or Space: Run the action.
- Escape: Close it.
- It is a shortcut: the same actions must also be somewhere visible.

## Examples

### On a file

Right-click the file, or Tab to it and press Shift+F10.

```html
<div tabindex="0" [uiContextMenu]="fileActions">invoice-1042.pdf</div>
<ng-template #fileActions>
  <ui-menu>
    <button ui-menu-item (triggered)="rename()">Rename</button>
    <button ui-menu-item (triggered)="copy()">Make a copy</button>
    <button ui-menu-item danger (triggered)="remove()">Delete</button>
  </ui-menu>
</ng-template>
```
