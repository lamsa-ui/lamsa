import { createApp, defineComponent, h, nextTick } from 'vue';
import {
  AppShell,
  ChipInput,
  CommandPalette,
  DataTable,
  ToastProvider,
  useToast,
} from './collections';

function mount(render: () => ReturnType<typeof h>) {
  const container = document.createElement('div');
  document.body.append(container);
  const app = createApp(defineComponent({ setup: () => render }));
  app.mount(container);
  return {
    container,
    unmount: () => {
      app.unmount();
      container.remove();
    },
  };
}

const settle = async () => {
  for (let i = 0; i < 3; i++) {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
  }
};

const key = (el: Element, k: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

describe('Vue chip input, command palette, data table, toast, app shell', () => {
  it('adds chips with Enter, skips duplicates and moves focus after a remove', async () => {
    const onUpdate = vi.fn();
    const view = mount(() =>
      h(ChipInput, {
        label: 'Tags',
        modelValue: ['cairo'],
        'onUpdate:modelValue': onUpdate,
      }),
    );
    const input =
      view.container.querySelector<HTMLInputElement>('.ui-chips__input')!;
    input.value = 'giza';
    key(input, 'Enter');
    expect(onUpdate).toHaveBeenLastCalledWith(['cairo', 'giza']);
    await settle();
    input.value = 'giza';
    key(input, 'Enter');
    expect(onUpdate).toHaveBeenCalledTimes(1);
    view.container.querySelector<HTMLButtonElement>('.ui-tag__remove')!.click();
    await settle();
    expect(onUpdate).toHaveBeenLastCalledWith(['giza']);
    expect(document.activeElement?.classList).toContain('ui-tag__remove');
    view.unmount();
  });

  it('filters commands and runs the active one with Enter', async () => {
    const onRun = vi.fn();
    const view = mount(() =>
      h(CommandPalette, {
        open: true,
        commands: [
          { id: 'new', label: 'New order', keywords: ['create'] },
          { id: 'find', label: 'Find customer' },
        ],
        onRun,
      }),
    );
    await settle();
    const input =
      document.querySelector<HTMLInputElement>('.ui-command input')!;
    input.value = 'create';
    input.dispatchEvent(new Event('input'));
    await settle();
    expect(
      document.querySelectorAll('.ui-command [role="option"]'),
    ).toHaveLength(1);
    key(input, 'Enter');
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(onRun).toHaveBeenCalledWith(expect.objectContaining({ id: 'new' }));
    view.unmount();
  });

  it('sorts from the header and fills cells from slots', async () => {
    const onSort = vi.fn();
    const view = mount(() =>
      h(
        DataTable,
        {
          caption: 'Orders',
          columns: [
            { key: 'id', header: 'Order', sortable: true },
            { key: 'status', header: 'Status' },
          ],
          rows: [{ id: '1042', status: 'paid' }],
          rowKey: 'id',
          'onUpdate:sort': onSort,
        },
        {
          'cell-status': ({ row }: { row: { status: string } }) =>
            h('b', row.status),
        },
      ),
    );
    const th = view.container.querySelector('th');
    expect(th?.getAttribute('aria-sort')).toBe('none');
    view.container.querySelector<HTMLButtonElement>('.ui-table__sort')!.click();
    expect(onSort).toHaveBeenCalledWith({ key: 'id', direction: 'ascending' });
    expect(view.container.querySelector('td b')?.textContent).toBe('paid');
    view.unmount();
  });

  it('shows a toast through useToast and reads danger ones at once', async () => {
    let api!: ReturnType<typeof useToast>;
    const Child = defineComponent({
      setup() {
        api = useToast();
        return () => null;
      },
    });
    const view = mount(() => h(ToastProvider, null, () => h(Child)));
    api.show('Card declined', { tone: 'danger', title: 'Payment failed' });
    await settle();
    expect(
      document.querySelector('[data-testid="ui-toast"]')?.textContent,
    ).toContain('Card declined');
    expect(
      document.querySelector('[aria-live="assertive"]')?.textContent,
    ).toContain('Payment failed. Card declined');
    (
      document.querySelector('[aria-label="Dismiss"]') as HTMLButtonElement
    ).click();
    await settle();
    expect(document.querySelector('[data-testid="ui-toast"]')).toBeNull();
    view.unmount();
  });

  it('opens the app shell menu and closes it with Escape', async () => {
    const view = mount(() =>
      h(AppShell, null, {
        sidebar: () => h('a', { href: '/orders' }, 'Orders'),
        default: () => h('p', 'Page'),
      }),
    );
    const menu =
      view.container.querySelector<HTMLButtonElement>('.ui-shell__menu')!;
    menu.click();
    await settle();
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toBe('Orders');
    key(document.activeElement!, 'Escape');
    await settle();
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menu);
    view.unmount();
  });
});
