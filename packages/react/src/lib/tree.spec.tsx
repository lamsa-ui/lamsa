import { fireEvent, render, screen, within } from '@testing-library/react';
import { Tree, type TreeNode } from './tree.js';

const nodes: TreeNode[] = [
  {
    id: 'mains',
    label: 'Mains',
    children: [
      { id: 'grill', label: 'Grill' },
      { id: 'pasta', label: 'Pasta' },
    ],
  },
  { id: 'drinks', label: 'Drinks', children: [{ id: 'tea', label: 'Tea' }] },
];

describe('Tree', () => {
  it('is named, opens branches, indents levels and selects', () => {
    const onSelectedChange = vi.fn();
    render(
      <Tree
        label="Menu"
        nodes={nodes}
        defaultExpanded={['mains']}
        onSelectedChange={onSelectedChange}
      />,
    );
    const tree = screen.getByRole('treegrid', { name: 'Menu' });
    const row = (name: string) => within(tree).getByRole('row', { name });

    expect(row('Mains').getAttribute('aria-expanded')).toBe('true');
    expect(row('Mains').className).toContain('ui-tree__item--expanded');
    expect(row('Grill').style.getPropertyValue('--ui-tree-level')).toBe('1');
    expect(within(tree).queryByRole('row', { name: 'Tea' })).toBeNull();

    fireEvent.click(row('Pasta'));
    expect(onSelectedChange).toHaveBeenCalledWith('pasta');
  });
});
