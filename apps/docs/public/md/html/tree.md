# Tree

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Nested items that open and close, such as folders or menu categories. One Tab stop: the arrow keys move, Right opens a branch and Left closes it, typing a name jumps to it, and Enter or Space selects. For a site's page links, use navigation instead.

Docs: https://ghazal-ui.github.io/ghazal/components/tree

```html
<!-- Keys, focus and opening need script: use the Angular or React component.
     The classes are ui-tree, ui-tree__item, ui-tree__chevron and --ui-tree-level. -->
```

When to use something else:

- A flat list with columns: [Data table](https://ghazal-ui.github.io/ghazal/components/data-table)
- Sections that open and close: [Accordion](https://ghazal-ui.github.io/ghazal/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-tree \| ui-tree__item` | `class` |  | The tree and each row. Set --ui-tree-level on a row to indent it. |
| `ui-tree__item--selected \| --expanded` | `class` |  | Selected row; open branch (turns its chevron). |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

- Tab: Reach the tree; it is one Tab stop.
- Up or Down: Move to the previous or next item.
- Right: Open a branch, or move into it.
- Left: Close a branch, or move to its parent.
- Letters: Jump to the item that starts with them.
- Enter or Space: Select the item.
- Read as a tree: each item says its level, whether it is open, and whether it is selected.

## Examples

### Menu categories

The selected item is bold as well as highlighted, so it never depends on colour.

```html
<!-- Use the Angular or React component. -->
```

### In Arabic

```html
<!-- dir="rtl" on the page: levels indent from the right and the chevrons flip -->
```
