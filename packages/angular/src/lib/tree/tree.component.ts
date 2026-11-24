import {
  CdkTree,
  CdkTreeNode,
  CdkTreeNodeDef,
  CdkTreeNodeToggle,
} from '@angular/cdk/tree';
import {
  afterNextRender,
  Component,
  input,
  model,
  viewChild,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

/**
 * Nested items that open and close, such as folders or categories, on the Angular CDK tree:
 * arrow keys move, Right and Left open and close, typing jumps to a name, and Enter, Space
 * or a click selects. The chevron opens and closes a branch with the pointer.
 *
 * ```html
 * <ui-tree label="Menu" [nodes]="categories" [expanded]="['mains']" [(selected)]="category" />
 * ```
 */
@Component({
  selector: 'ui-tree',
  imports: [
    IconComponent,
    CdkTree,
    CdkTreeNode,
    CdkTreeNodeDef,
    CdkTreeNodeToggle,
  ],
  template: `
    <cdk-tree
      class="ui-tree"
      [dataSource]="nodes()"
      [childrenAccessor]="children"
      [trackBy]="trackById"
      [attr.aria-label]="label()"
    >
      <!-- Keyboard selection is the CDK's (activation) on Enter and Space; the click is for the pointer. -->
      <cdk-tree-node
        *cdkTreeNodeDef="let node; let level = level"
        #item="cdkTreeNode"
        class="ui-tree__item"
        [class.ui-tree__item--selected]="node.id === selected()"
        [class.ui-tree__item--expanded]="item.isExpanded"
        [style.--ui-tree-level]="level"
        [isExpandable]="!!node.children?.length"
        [attr.aria-selected]="node.id === selected()"
        (activation)="selected.set(node.id)"
        (click)="selected.set(node.id)"
      >
        @if (node.children?.length) {
          <span class="ui-tree__chevron" cdkTreeNodeToggle aria-hidden="true">
            <ui-icon name="chevron-right" />
          </span>
        } @else {
          <span class="ui-tree__chevron" aria-hidden="true"></span>
        }
        {{ node.label }}
      </cdk-tree-node>
    </cdk-tree>
  `,
})
export class TreeComponent {
  /** Names the tree: "Files", "Menu". */
  readonly label = input.required<string>();
  readonly nodes = input.required<TreeNode[]>();
  /** Ids of the branches open at the start. */
  readonly expanded = input<string[]>([]);
  /** Id of the selected item. */
  readonly selected = model<string | null>(null);

  protected readonly children = (node: TreeNode) => node.children ?? [];
  private readonly tree = viewChild.required(CdkTree<TreeNode>);

  constructor() {
    // Open the starting branches once the CDK has set its first Tab stop, so that stop is
    // the first item. Opening them while the tree first renders put it on a child instead.
    afterNextRender(() => {
      const open = (nodes: TreeNode[]) =>
        nodes.forEach((node) => {
          if (this.expanded().includes(node.id)) this.tree().expand(node);
          open(node.children ?? []);
        });
      open(this.nodes());
    });
  }
  protected readonly trackById = (_: number, node: TreeNode) => node.id;
}
