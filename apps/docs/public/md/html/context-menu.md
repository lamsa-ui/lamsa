# Context menu

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Actions that open where the reader right-clicks, long-presses, or presses Shift+F10 on the focused item. It is a shortcut: the same actions must also be somewhere visible, because touch and keyboard users rarely look for one.

Docs: https://lamsa-ui.github.io/lamsa/components/context-menu

```html
<!-- Plain HTML: listen for contextmenu and open a .ui-menu list in a popover. -->
```

When to use something else:

- The visible way to the same actions: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)
- Actions that should always be on screen: [Toolbar](https://lamsa-ui.github.io/lamsa/components/toolbar)
- Search every command in the app: [Command palette](https://lamsa-ui.github.io/lamsa/components/command-palette)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-menu` | `class` |  | The list, with role="menu". Opening, focus and keys are your script. |
| `ui-menu__item` | `class` |  | One action, with role="menuitem". --danger for red text. |

## Examples

### On a file

Right-click the file, or Tab to it and press Shift+F10.

```html
<div tabindex="0" id="file">invoice-1042.pdf</div>
<div class="ui-menu" role="menu" id="file-menu" popover>
  <button class="ui-menu__item" role="menuitem" type="button">Rename</button>
  <button class="ui-menu__item ui-menu__item--danger" role="menuitem" type="button">Delete</button>
</div>
<script>
  // Open at the pointer, move focus into the menu, arrow keys move, Escape closes.
  document.getElementById('file').addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const menu = document.getElementById('file-menu');
    menu.style.position = 'fixed';
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';
    menu.showPopover();
    menu.querySelector('button').focus();
  });
</script>
```
