# Command palette

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A search over the app's actions, in a dialog. Ctrl+K or ⌘K opens it from anywhere; typing filters, the arrow keys move and Enter runs. Screen readers hear how many commands match as you type. Keep a visible button for it too: a shortcut nobody knows about is no way in.

Docs: https://lamsa-ui.github.io/lamsa/components/command-palette

```html
<!-- Filtering, keys and focus need script: use the Angular or React component.
     The classes are ui-command, ui-command__list, ui-option and ui-command__shortcut. -->
```

When to use something else:

- Pick a value inside a form: [Combobox](https://lamsa-ui.github.io/lamsa/components/combobox)
- Search the items of one list: [Search field](https://lamsa-ui.github.io/lamsa/components/search-field)
- A few actions on one thing: [Menu](https://lamsa-ui.github.io/lamsa/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-command` | `class` |  | The field and list inside a .ui-dialog. |
| `ui-command__list \| __empty \| __shortcut` | `class` |  | The list of .ui-option items, the no-match text, a key hint. |

## Examples

### Commands

Press Ctrl+K (⌘K on a Mac) on this page, or the button. Try typing invoice: keywords find New order.

```html
<!-- Use the Angular or React component. -->
```
