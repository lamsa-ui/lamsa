# Menu

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short list of actions that opens from a button, such as the actions on a row. Enter, Space or the down arrow open it, the arrow keys and typing move through it, and Escape closes it and puts focus back on the button. For choosing a value, use a select.

Docs: https://lamsa-ui.github.io/lamsa/components/menu

```ts
import { MenuComponent, MenuItemComponent, MenuTriggerDirective } from '@lamsa-ui/angular';
// On the Angular CDK menu. Add @angular/cdk/overlay-prebuilt.css.
```

When to use something else:

- The same actions on right-click or a long press: [Context menu](https://lamsa-ui.github.io/lamsa/components/context-menu)
- Pick a value that a form sends: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Links that go to other pages: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Two or three actions that fit on screen: [Button group](https://lamsa-ui.github.io/lamsa/components/button-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `[uiMenuTrigger]` | `TemplateRef` |  | On the button; the template holding the ui-menu. |
| `ui-menu` | `component` |  | The list, inside that template. |
| `button[ui-menu-item]` | `component` |  | One action. |
| `(triggered)` | `void` |  | The action was chosen by click, Enter or Space. |
| `danger` | `boolean` | `false` | Red text, for an action that destroys something. |
| `disabled` | `boolean` | `false` | Shown, but cannot be chosen. |

Keyboard and screen readers:

- Enter or Space or Down: Open the menu from its button.
- Up or Down: Move through the actions.
- Letters: Jump to the action that starts with them.
- Enter or Space: Run the action.
- Escape: Close it, and put focus back on the button.
- Read as a menu of items; the button says it opens a menu.

## Examples

### Row actions

```html
<button ui-button variant="secondary" [uiMenuTrigger]="actions">Actions</button>
<ng-template #actions>
  <ui-menu>
    <button ui-menu-item (triggered)="edit()">Edit</button>
    <button ui-menu-item (triggered)="duplicate()">Duplicate</button>
    <button ui-menu-item disabled>Archive</button>
    <div class="ui-menu__separator" role="separator"></div>
    <button ui-menu-item danger (triggered)="remove()">Delete</button>
  </ui-menu>
</ng-template>
```

### In Arabic

```html
<button ui-button variant="secondary" [uiMenuTrigger]="menu">إجراءات</button>
<ng-template #menu>
  <ui-menu>
    <button ui-menu-item>تعديل</button>
    <button ui-menu-item danger>حذف</button>
  </ui-menu>
</ng-template>
```
