# Tree

Framework: Angular. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

Nested items that open and close, such as folders or menu categories. One Tab stop: the arrow keys move, Right opens a branch and Left closes it, typing a name jumps to it, and Enter or Space selects. For a site's page links, use navigation instead.

Docs: https://ghazal-ui.github.io/ghazal/components/tree

```ts
import { TreeComponent, type TreeNode } from '@ghazal-ui/angular';
// On the Angular CDK tree.
```

When to use something else:

- A flat list with columns: [Data table](https://ghazal-ui.github.io/ghazal/components/data-table)
- Sections that open and close: [Accordion](https://ghazal-ui.github.io/ghazal/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the tree: "Menu", "Files". |
| `nodes` | `TreeNode[]` |  | Required. { id, label, children? }, nested as deep as needed. |
| `expanded` | `string[]` | `[]` | Ids of the branches open at the start. |
| `[(selected)]` | `string \| null` | `null` | Id of the selected item. |

Keyboard and screen readers:

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
<ui-tree label="Menu" [nodes]="menu" [expanded]="['mains']" [(selected)]="selected" />

menu: TreeNode[] = [
  { id: 'mains', label: 'Mains', children: [
    { id: 'grill', label: 'Grill', children: [{ id: 'kofta', label: 'Kofta' }] },
    { id: 'pasta', label: 'Pasta' },
  ] },
  { id: 'desserts', label: 'Desserts' },
];
```

### In Arabic

```html
<ui-tree label="القائمة" [nodes]="menu" [expanded]="['mains']" />
```
