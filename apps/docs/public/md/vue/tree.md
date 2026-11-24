# Tree

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

Nested items that open and close, such as folders or menu categories. One Tab stop: the arrow keys move, Right opens a branch and Left closes it, typing a name jumps to it, and Enter or Space selects. For a site's page links, use navigation instead.

Docs: https://lamsa-ui.github.io/lamsa/components/tree

```ts
import { Tree, type TreeNode } from '@lamsa-ui/vue';
// On the React Aria tree.
```

When to use something else:

- A flat list with columns: [Data table](https://lamsa-ui.github.io/lamsa/components/data-table)
- Sections that open and close: [Accordion](https://lamsa-ui.github.io/lamsa/components/accordion)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Required. Names the tree: "Menu", "Files". |
| `nodes` | `TreeNode[]` |  | Required. { id, label, children? }, nested as deep as needed. |
| `defaultExpanded` | `string[]` |  | Ids of the branches open at first. |
| `v-model:selected` | `string` |  | The selected node's id. |

## Examples

### Menu categories

The selected item is bold as well as highlighted, so it never depends on colour.

```vue
<Tree
  v-model:selected="selected"
  label="Menu"
  :nodes="menu"
  :defaultExpanded="['mains']"
/>
```

### In Arabic

```vue
<Tree label="القائمة" :nodes="menu" :defaultExpanded="['mains']" />
```
