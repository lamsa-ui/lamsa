# Command palette

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A search over the app's actions, in a dialog. Ctrl+K or ⌘K opens it from anywhere; typing filters, the arrow keys move and Enter runs. Screen readers hear how many commands match as you type. Keep a visible button for it too: a shortcut nobody knows about is no way in.

Docs: https://ghazal-ui.github.io/ghazal/components/command-palette

```html
<!-- Filtering, keys and focus need script: use the Angular or React component.
     The classes are ui-command, ui-command__list, ui-option and ui-command__shortcut. -->
```

When to use something else:

- Pick a value inside a form: [Combobox](https://ghazal-ui.github.io/ghazal/components/combobox)
- Search the items of one list: [Search field](https://ghazal-ui.github.io/ghazal/components/search-field)
- A few actions on one thing: [Menu](https://ghazal-ui.github.io/ghazal/components/menu)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-command` | `class` |  | The field and list inside a .ui-dialog. |
| `ui-command__list \| __empty \| __shortcut` | `class` |  | The list of .ui-option items, the no-match text, a key hint. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Ctrl + K or ⌘ + K: Open it from anywhere.
- Up or Down: Move through the matching commands, wrapping round.
- Enter: Run the highlighted command.
- Escape: Close it.
- How many commands match is announced as you type.
- Keep a visible button for it too: a shortcut nobody knows about is no way in.

## Examples

### Commands

Press Ctrl+K (⌘K on a Mac) on this page, or the button. Try typing invoice: keywords find New order.

```html
<!-- Use the Angular or React component. -->
```
