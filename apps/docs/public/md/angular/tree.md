# Tree

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Nested items that open and close, such as folders or menu categories. One Tab stop: the arrow keys move, Right opens a branch and Left closes it, typing a name jumps to it, and Enter or Space selects. For a site's page links, use navigation instead.

Docs: https://lamsa-ui.github.io/lamsa/components/tree

```ts
import { TreeComponent, type TreeNode } from '@lamsa-ui/angular';
// On the Angular CDK tree.
```

When to use something else:

- A flat list with columns: [Data table](https://lamsa-ui.github.io/lamsa/components/data-table)
- Sections that open and close: [Accordion](https://lamsa-ui.github.io/lamsa/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the tree: "Menu", "Files". |
| `nodes` | `TreeNode[]` |  | Required. { id, label, children? }, nested as deep as needed. |
| `expanded` | `string[]` | `[]` | Ids of the branches open at the start. |
| `[(selected)]` | `string \| null` | `null` | Id of the selected item. |

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
