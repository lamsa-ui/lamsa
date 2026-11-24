# Toolbar

Framework: Vue 3. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A row of controls that counts as one stop for the Tab key. Inside it the arrow keys move from control to control, flipped in Arabic; Home and End jump to the ends. Tab again leaves it.

Docs: https://ghazal-ui.github.io/ghazal/components/toolbar

```ts
import { Toolbar, ToolbarSeparator } from '@ghazal-ui/vue';
```

When to use something else:

- Two or three buttons that sit together: [Button group](https://ghazal-ui.github.io/ghazal/components/button-group)
- Links to other pages: [Navigation](https://ghazal-ui.github.io/ghazal/components/nav)
- Actions that do not fit, behind one button: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. What the controls act on, for screen readers. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Which arrow keys move: left and right, or up and down. |
| `<ToolbarSeparator>` | `component` |  | A line between groups of controls. |

Keyboard and screen readers:

- Tab: Enter the toolbar, and Tab again leaves it.
- Left or Right: Move to the previous or next control, wrapping round. Flipped in Arabic.
- Up or Down: The same, in a vertical toolbar.
- Home or End: Go to the first or last control.
- Read as a toolbar with its name and orientation.

## Examples

### Editor actions

Tab in, then use the arrow keys. Tab out and back: focus returns to the last control you used.

```vue
<Toolbar label="Note">
  <Button variant="ghost" icon-only aria-label="Undo"><Icon name="undo-2" /></Button>
  <Button variant="ghost" icon-only aria-label="Redo"><Icon name="redo-2" /></Button>
  <ToolbarSeparator />
  <Toggle size="sm" icon-only aria-label="Pin"><Icon name="bookmark" /></Toggle>
  <Button variant="ghost">Copy</Button>
  <Button variant="ghost">Delete</Button>
</Toolbar>
```

### In Arabic

```vue
<Toolbar label="الطلب">
  <Button variant="ghost">طباعة</Button>
  <Button variant="ghost">استرداد</Button>
  <Button variant="ghost">إلغاء</Button>
</Toolbar>
```
