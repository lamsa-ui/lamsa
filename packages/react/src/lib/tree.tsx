'use client';

import {
  Button,
  Collection,
  Tree as AriaTree,
  TreeItem,
  TreeItemContent,
  type Key,
} from 'react-aria-components';
import type { CSSProperties } from 'react';
import { cx } from './class-names.js';
import { Icon } from './icon.js';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeProps {
  /** Names the tree: "Files", "Menu". */
  label: string;
  nodes: TreeNode[];
  /** Ids of the branches open at the start. */
  defaultExpanded?: string[];
  /** Id of the selected item. */
  selected?: string | null;
  onSelectedChange?: (id: string) => void;
  className?: string;
}

const Chevron = () => <Icon name="chevron-right" />;

function Item({ node }: { node: TreeNode }) {
  return (
    <TreeItem
      id={node.id}
      textValue={node.label}
      className={({ isSelected, isExpanded, isFocusVisible }) =>
        cx(
          'ui-tree__item',
          isSelected && 'ui-tree__item--selected',
          isExpanded && 'ui-tree__item--expanded',
          isFocusVisible && 'ui-tree__item--focus',
        )
      }
      style={({ level }) => ({ '--ui-tree-level': level - 1 }) as CSSProperties}
    >
      <TreeItemContent>
        {({ hasChildItems }) => (
          <>
            {hasChildItems ? (
              <Button slot="chevron" className="ui-tree__chevron">
                <Chevron />
              </Button>
            ) : (
              <span className="ui-tree__chevron" aria-hidden="true" />
            )}
            {node.label}
          </>
        )}
      </TreeItemContent>
      {node.children && (
        <Collection items={node.children}>
          {(child) => <Item node={child} />}
        </Collection>
      )}
    </TreeItem>
  );
}

/**
 * Nested items that open and close, such as folders or categories, on React Aria: arrow
 * keys move, Right and Left open and close, typing jumps to a name, Enter or a click selects.
 *
 * ```tsx
 * <Tree label="Menu" nodes={categories} defaultExpanded={['mains']} selected={id} onSelectedChange={setId} />
 * ```
 */
export function Tree({
  label,
  nodes,
  defaultExpanded,
  selected,
  onSelectedChange,
  className,
}: TreeProps) {
  return (
    <AriaTree
      aria-label={label}
      items={nodes}
      className={cx('ui-tree', className)}
      selectionMode="single"
      disallowEmptySelection
      defaultExpandedKeys={defaultExpanded}
      selectedKeys={selected ? [selected] : []}
      onSelectionChange={(keys) => {
        const [id] = keys === 'all' ? [] : [...keys];
        if (id !== undefined) onSelectedChange?.(String(id as Key));
      }}
    >
      {(node) => <Item node={node} />}
    </AriaTree>
  );
}
