// Roles, names and keys of the components the other specs do not reach.
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  ButtonGroup,
  Kbd,
  Property,
  PropertyList,
  Toolbar,
} from './actions.js';
import { Button } from './button.js';
import { ContextMenu } from './menu.js';

describe('accessibility basics', () => {
  it('names a button group', () => {
    render(
      <ButtonGroup label="Text alignment">
        <Button>Start</Button>
        <Button>End</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Text alignment' });
    expect(group.querySelectorAll('button')).toHaveLength(2);
  });

  it('makes a toolbar one tab stop that the arrow keys move through', () => {
    render(
      <Toolbar label="Note">
        <Button>Undo</Button>
        <Button>Redo</Button>
      </Toolbar>,
    );
    const toolbar = screen.getByRole('toolbar', { name: 'Note' });
    expect(toolbar.getAttribute('aria-orientation')).toBe('horizontal');
    const undo = screen.getByRole('button', { name: 'Undo' });
    act(() => undo.focus());
    fireEvent.keyDown(undo, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Redo' }),
    );
  });

  it('writes a key on the native kbd element', () => {
    const { container } = render(<Kbd>Ctrl</Kbd>);
    const key = container.querySelector('kbd')!;
    expect(key.className).toBe('ui-kbd');
    expect(key.textContent).toBe('Ctrl');
  });

  it('pairs each term with its value in a description list', () => {
    const { container } = render(
      <PropertyList>
        <Property term="Order">#1042</Property>
      </PropertyList>,
    );
    const list = container.querySelector('dl')!;
    expect(list.querySelector('dt')!.textContent).toBe('Order');
    expect(list.querySelector('dd')!.textContent).toBe('#1042');
  });

  it('opens a context menu from the keyboard and runs an action', () => {
    const ran = vi.fn();
    render(
      <ContextMenu
        items={[
          { id: 'rename', label: 'Rename' },
          { id: 'delete', label: 'Delete', danger: true },
        ]}
        onAction={ran}
      >
        <div tabIndex={0}>invoice.pdf</div>
      </ContextMenu>,
    );
    // Shift+F10 and the menu key fire contextmenu with no pointer position.
    fireEvent.contextMenu(screen.getByText('invoice.pdf'));
    const menu = screen.getByRole('menu');
    const rename = screen.getByRole('menuitem', { name: 'Rename' });
    expect(menu.contains(rename)).toBe(true);
    fireEvent.click(rename);
    expect(ran).toHaveBeenCalledWith('rename');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
