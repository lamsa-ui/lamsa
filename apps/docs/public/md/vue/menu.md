# Menu

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short list of actions that opens from a button, such as the actions on a row. Enter, Space or the down arrow open it, the arrow keys and typing move through it, and Escape closes it and puts focus back on the button. For choosing a value, use a select.

Docs: https://lamsa-ui.github.io/lamsa/components/menu

```ts
import { Menu } from '@lamsa-ui/vue';
```

When to use something else:

- The same actions on right-click or a long press: [Context menu](https://lamsa-ui.github.io/lamsa/components/context-menu)
- Pick a value that a form sends: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Links that go to other pages: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Two or three actions that fit on screen: [Button group](https://lamsa-ui.github.io/lamsa/components/button-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `#label` | `slot` |  | Required. The button's content. |
| `aria-label` | `string` |  | The button's name, when its content is an icon. |
| `items` | `MenuAction[]` |  | Required. { id, label, danger?, disabled? }. |
| `@action` | `event` |  | Required. Called with the chosen action's id. |
| `variant` | `ButtonVariant` | `'secondary'` | The button's look. |

## Examples

### Row actions

```vue
<Menu
  label="Actions"
  :items="[
    { id: 'edit', label: 'Edit' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'archive', label: 'Archive', disabled: true },
    { id: 'delete', label: 'Delete', danger: true },
  ]"
  @action="(id) => run(id)"
/>
```

### In Arabic

```vue
<Menu label="إجراءات" :items="[{ id: 'edit', label: 'تعديل' }]" @action="run" />
```
