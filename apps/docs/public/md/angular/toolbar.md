# Toolbar

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A row of controls that counts as one stop for the Tab key. Inside it the arrow keys move from control to control, flipped in Arabic; Home and End jump to the ends. Tab again leaves it.

Docs: https://ghazal-ui.github.io/ghazal/components/toolbar

```ts
import { ToolbarComponent, ToolbarSeparatorComponent } from '@ghazal-ui/angular';
```

When to use something else:

- Two or three buttons that sit together: [Button group](https://ghazal-ui.github.io/ghazal/components/button-group)
- Links to other pages: [Navigation](https://ghazal-ui.github.io/ghazal/components/nav)
- Actions that do not fit, behind one button: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. What the controls act on, for screen readers. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Which arrow keys move: left and right, or up and down. |
| `<ui-toolbar-separator>` | `component` |  | A line between groups of controls. |

Keyboard and screen readers:

- Tab: Enter the toolbar, and Tab again leaves it.
- Left or Right: Move to the previous or next control, wrapping round. Flipped in Arabic.
- Up or Down: The same, in a vertical toolbar.
- Home or End: Go to the first or last control.
- Read as a toolbar with its name and orientation.

## Examples

### Editor actions

Tab in, then use the arrow keys. Tab out and back: focus returns to the last control you used.

```html
<ui-toolbar label="Note">
  <button ui-button variant="ghost" iconOnly type="button" aria-label="Undo">
    <ui-icon name="undo-2" />
  </button>
  <button ui-button variant="ghost" iconOnly type="button" aria-label="Redo">
    <ui-icon name="redo-2" />
  </button>
  <ui-toolbar-separator />
  <button ui-toggle size="sm" iconOnly aria-label="Pin">
    <ui-icon name="bookmark" />
  </button>
  <button ui-button variant="ghost" type="button">Copy</button>
  <button ui-button variant="ghost" type="button">Delete</button>
</ui-toolbar>
```

### In Arabic

```html
<ui-toolbar label="الطلب">
  <button ui-button variant="ghost" type="button">طباعة</button>
  <button ui-button variant="ghost" type="button">استرداد</button>
  <button ui-button variant="ghost" type="button">إلغاء</button>
</ui-toolbar>
```
