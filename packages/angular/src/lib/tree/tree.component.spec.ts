import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TreeComponent, type TreeNode } from './tree.component';

@Component({
  imports: [TreeComponent],
  template: `<ui-tree
    label="Menu"
    [nodes]="nodes"
    [expanded]="['mains']"
    [(selected)]="selected"
  />`,
})
class HostComponent {
  readonly nodes: TreeNode[] = [
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
  readonly selected = signal<string | null>(null);
}

describe('TreeComponent', () => {
  it('is a named tree with levels, open branches and selection', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const tree = el.querySelector('[role="tree"]')!;
    expect(tree.getAttribute('aria-label')).toBe('Menu');
    const item = (name: string) =>
      Array.from(el.querySelectorAll<HTMLElement>('[role="treeitem"]')).find(
        (i) => i.textContent!.trim() === name,
      )!;

    expect(item('Mains').getAttribute('aria-expanded')).toBe('true');
    expect(item('Grill').getAttribute('aria-level')).toBe('2');
    expect(item('Drinks').getAttribute('aria-expanded')).toBe('false');
    expect(item('Grill').style.getPropertyValue('--ui-tree-level')).toBe('1');

    item('Pasta').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toBe('pasta');
    expect(item('Pasta').getAttribute('aria-selected')).toBe('true');
    expect(item('Pasta').className).toContain('ui-tree__item--selected');

    item('Drinks').querySelector<HTMLElement>('.ui-tree__chevron')!.click();
    await fixture.whenStable();
    expect(item('Drinks').getAttribute('aria-expanded')).toBe('true');
  });
});
