# Menu

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A short list of actions that opens from a button, such as the actions on a row. Enter, Space or the down arrow open it, the arrow keys and typing move through it, and Escape closes it and puts focus back on the button. For choosing a value, use a select.

Docs: https://lamsa-ui.github.io/lamsa/components/menu

```html
<!-- A menu needs script for the keyboard. Follow the WAI-ARIA menu button pattern with these classes: -->
<button class="ui-button ui-button--secondary" aria-haspopup="menu" aria-expanded="true">Actions</button>
<div class="ui-menu" role="menu">
  <button class="ui-menu__item" role="menuitem" tabindex="-1">Edit</button>
  <button class="ui-menu__item ui-menu__item--danger" role="menuitem" tabindex="-1">Delete</button>
</div>
```

When to use something else:

- The same actions on right-click or a long press: [Context menu](https://lamsa-ui.github.io/lamsa/components/context-menu)
- Pick a value that a form sends: [Select](https://lamsa-ui.github.io/lamsa/components/select)
- Links that go to other pages: [Navigation](https://lamsa-ui.github.io/lamsa/components/nav)
- Two or three actions that fit on screen: [Button group](https://lamsa-ui.github.io/lamsa/components/button-group)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-menu` | `class` |  | On the element with role="menu". |
| `ui-menu__item` | `class` |  | On each role="menuitem". |
| `ui-menu__item--danger` | `class` |  | Red text, for a destructive action. |
| `ui-menu__separator` | `class` |  | A line between groups, with role="separator". |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Enter or Space or Down: Open the menu from its button.
- Up or Down: Move through the actions.
- Letters: Jump to the action that starts with them.
- Enter or Space: Run the action.
- Escape: Close it, and put focus back on the button.
- Read as a menu of items; the button says it opens a menu.

## Examples

### Row actions

```html
<!-- See "Use it" -->
```

### In Arabic

```html
<!-- dir="rtl" on the page; the markup is the same -->
```
