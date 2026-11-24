# Tree

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Nested items that open and close, such as folders or menu categories. One Tab stop: the arrow keys move, Right opens a branch and Left closes it, typing a name jumps to it, and Enter or Space selects. For a site's page links, use navigation instead.

Docs: https://lamsa-ui.github.io/lamsa/components/tree

```tsx
import { Tree, type TreeNode } from '@lamsa-ui/react';
// On the React Aria tree.
```

When to use something else:

- A flat list with columns: [Data table](https://lamsa-ui.github.io/lamsa/components/data-table)
- Sections that open and close: [Accordion](https://lamsa-ui.github.io/lamsa/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the tree: "Menu", "Files". |
| `nodes` | `TreeNode[]` |  | Required. { id, label, children? }, nested as deep as needed. |
| `defaultExpanded` | `string[]` |  | Ids of the branches open at the start. |
| `selected \| onSelectedChange` | `string \| (id) => void` |  | Id of the selected item, and the change. |

## Examples

### Menu categories

The selected item is bold as well as highlighted, so it never depends on colour.

```tsx
<Tree
  label="Menu"
  nodes={menu}
  defaultExpanded={['mains']}
  selected={selected}
  onSelectedChange={setSelected}
/>
```

### In Arabic

```tsx
<Tree label="القائمة" nodes={menu} defaultExpanded={['mains']} />
```
