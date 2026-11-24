# Tree

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Nested items that open and close, such as folders or menu categories. One Tab stop: the arrow keys move, Right opens a branch and Left closes it, typing a name jumps to it, and Enter or Space selects. For a site's page links, use navigation instead.

Docs: https://lamsa-ui.github.io/lamsa/components/tree

```html
<!-- Keys, focus and opening need script: use the Angular or React component.
     The classes are ui-tree, ui-tree__item, ui-tree__chevron and --ui-tree-level. -->
```

When to use something else:

- A flat list with columns: [Data table](https://lamsa-ui.github.io/lamsa/components/data-table)
- Sections that open and close: [Accordion](https://lamsa-ui.github.io/lamsa/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-tree \| ui-tree__item` | `class` |  | The tree and each row. Set --ui-tree-level on a row to indent it. |
| `ui-tree__item--selected \| --expanded` | `class` |  | Selected row; open branch (turns its chevron). |

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
