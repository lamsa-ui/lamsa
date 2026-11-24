import { TreeItem as RekaTreeItem, TreeRoot as RekaTreeRoot } from 'reka-ui';
import {
  defineComponent,
  h,
  ref,
  watch,
  type Component,
  type PropType,
} from 'vue';
import { Icon } from './content.js';

// Reka's tree is generic over Record<string, any>; our nodes are narrower, so loosen the types here.
const TreeRoot = RekaTreeRoot as Component;
const TreeItem = RekaTreeItem as Component;

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeProps {
  /** Names the tree. */
  label: string;
  nodes: TreeNode[];
  /** Ids of the nodes open at first. */
  defaultExpanded?: string[];
  /** The selected node's id. Bind with v-model:selected. */
  selected?: string | null;
}

function find(nodes: TreeNode[], id?: string | null): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const deeper = node.children && find(node.children, id);
    if (deeper) return deeper;
  }
  return undefined;
}

/**
 * Nested items that open and close, such as a menu's sections. Arrow keys move,
 * right and left open and close, Enter selects.
 */
export const Tree = defineComponent({
  name: 'UiTree',
  props: {
    label: { type: String, required: true },
    nodes: { type: Array as PropType<TreeNode[]>, required: true },
    defaultExpanded: { type: Array as PropType<string[]>, default: () => [] },
    selected: { type: String as PropType<string | null>, default: undefined },
  },
  emits: { 'update:selected': (_id: string) => true },
  setup(props, { emit }) {
    const expanded = ref<string[]>([...props.defaultExpanded]);
    const selected = ref(props.selected ?? null);
    watch(
      () => props.selected,
      (id) => {
        if (id !== undefined) selected.value = id;
      },
    );
    return () =>
      h(
        TreeRoot,
        {
          class: 'ui-tree',
          'aria-label': props.label,
          items: props.nodes,
          getKey: (node: TreeNode) => node.id,
          getChildren: (node: TreeNode) => node.children,
          expanded: expanded.value,
          'onUpdate:expanded': (ids: string[]) => (expanded.value = ids),
          modelValue: find(props.nodes, selected.value),
          'onUpdate:modelValue': (node?: TreeNode) => {
            if (!node) return;
            selected.value = node.id;
            emit('update:selected', node.id);
          },
        },
        {
          default: ({
            flattenItems,
          }: {
            flattenItems: {
              _id: string;
              value: TreeNode;
              level: number;
              hasChildren: boolean;
              bind: Record<string, unknown>;
            }[];
          }) =>
            flattenItems.map((item) => {
              const open = expanded.value.includes(item._id);
              return h(
                TreeItem,
                {
                  key: item._id,
                  ...item.bind,
                  class: [
                    'ui-tree__item',
                    selected.value === item._id && 'ui-tree__item--selected',
                    open && 'ui-tree__item--expanded',
                  ],
                  style: { '--ui-tree-level': item.level - 1 },
                },
                () => [
                  item.hasChildren
                    ? h(
                        'span',
                        { class: 'ui-tree__chevron', 'aria-hidden': 'true' },
                        h(Icon, { name: 'chevron-right' }),
                      )
                    : h('span', {
                        class: 'ui-tree__chevron',
                        'aria-hidden': 'true',
                      }),
                  item.value.label,
                ],
              );
            }),
        },
      );
  },
});
