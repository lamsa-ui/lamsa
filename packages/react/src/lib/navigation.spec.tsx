import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu } from './menu.js';
import { Breadcrumbs, Nav } from './nav.js';
import { Tabs } from './tabs.js';

const tabs = [
  { id: 'details', label: 'Details', content: <p>Details panel</p> },
  {
    id: 'invoice',
    label: 'Invoice',
    content: <p>Invoice panel</p>,
    disabled: true,
  },
  { id: 'history', label: 'History', content: <p>History panel</p> },
];

describe('Tabs', () => {
  it('ties tabs to panels and moves with the arrow keys past disabled tabs', async () => {
    const onChange = vi.fn();
    render(<Tabs label="Order 1042" tabs={tabs} onChange={onChange} />);
    expect(screen.getByRole('tablist', { name: 'Order 1042' })).toBeTruthy();
    const details = screen.getByRole('tab', { name: 'Details' });
    expect(details.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toBe('Details panel');

    await userEvent.tab();
    expect(document.activeElement).toBe(details);
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('history');
    expect(screen.getByRole('tabpanel').textContent).toBe('History panel');
  });
});

describe('Breadcrumbs and Nav', () => {
  it('are named navigation landmarks', () => {
    render(
      <>
        <Breadcrumbs>
          <li>
            <a href="/orders">Orders</a>
          </li>
          <li>
            <span aria-current="page">Order 1042</span>
          </li>
        </Breadcrumbs>
        <Nav label="Main">
          <ul>
            <li>
              <a href="/orders" aria-current="page">
                Orders
              </a>
            </li>
          </ul>
        </Nav>
      </>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});

describe('Menu', () => {
  it('opens from its button and runs the chosen action', async () => {
    const onAction = vi.fn();
    render(
      <Menu
        label="Actions"
        items={[
          { id: 'edit', label: 'Edit' },
          { id: 'delete', label: 'Delete', danger: true },
        ]}
        onAction={onAction}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    await userEvent.click(trigger);
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    expect(items[1].classList).toContain('ui-menu__item--danger');

    await userEvent.click(items[1]);
    expect(onAction).toHaveBeenCalledWith('delete');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
