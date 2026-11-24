import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import { Accordion, AccordionItem, Popover, Tabs } from './disclosure';

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

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe = () => undefined;
    unobserve = () => undefined;
    disconnect = () => undefined;
  } as never;
});

const item = (heading: string, open = false) =>
  h(AccordionItem as Component, { heading, defaultOpen: open }, () =>
    h('p', heading),
  );

describe('Vue accordion, tabs and popover', () => {
  it('opens one section at a time when single, and moves between headings with arrows', async () => {
    const view = mount(() =>
      h(Accordion, { single: true }, () => [
        item('A', true),
        item('B'),
        item('C'),
      ]),
    );
    const details = view.container.querySelectorAll('details');
    expect(details[0].open).toBe(true);
    details[1].open = true;
    details[1].dispatchEvent(new Event('toggle'));
    await settle();
    expect(details[0].open).toBe(false);

    const summaries = view.container.querySelectorAll('summary');
    summaries[2].focus();
    summaries[2].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(document.activeElement).toBe(summaries[0]);
    view.unmount();
  });

  it('shows the selected tab panel from its named slot and reports changes', async () => {
    const onSelected = vi.fn();
    const view = mount(() =>
      h(
        Tabs,
        {
          label: 'Order',
          tabs: [
            { id: 'details', label: 'Details' },
            { id: 'history', label: 'History' },
            { id: 'invoice', label: 'Invoice', disabled: true },
          ],
          'onUpdate:selected': onSelected,
        },
        {
          details: () => h('p', 'Details panel'),
          history: () => h('p', 'History panel'),
        },
      ),
    );
    await settle();
    const list = view.container.querySelector('[role="tablist"]');
    expect(list?.getAttribute('aria-label')).toBe('Order');
    expect(view.container.querySelector('[role="tabpanel"]')?.textContent).toBe(
      'Details panel',
    );
    const tabs =
      view.container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs[2].disabled).toBe(true);
    tabs[1].dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    await settle();
    expect(onSelected).toHaveBeenCalledWith('history');
    view.unmount();
  });

  it('opens the popover as a dialog from its trigger', async () => {
    const view = mount(() =>
      h(Popover, null, {
        trigger: () => h('button', 'Delivery fee'),
        default: () => h('p', 'EGP 25 inside Cairo'),
      }),
    );
    view.container.querySelector('button')!.click();
    await settle();
    const popover = document.querySelector('.ui-popover');
    expect(popover?.getAttribute('role')).toBe('dialog');
    expect(popover?.textContent).toBe('EGP 25 inside Cairo');
    view.unmount();
  });
});
