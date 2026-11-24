import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import {
  Calendar,
  DatePicker,
  NumberField,
  RangeCalendar,
  SearchField,
} from './dates';
import { Tree } from './tree';

function mount(component: Component, props: Record<string, unknown> = {}) {
  const container = document.createElement('div');
  document.body.append(container);
  const app = createApp(
    defineComponent({ setup: () => () => h(component, props) }),
  );
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

const day = (container: Element, n: string) =>
  [
    ...container.querySelectorAll<HTMLElement>(
      '[data-reka-calendar-cell-trigger], [role="button"]',
    ),
  ].find(
    (el) =>
      el.textContent?.trim() === n &&
      !el.querySelector('.ui-calendar__day--outside'),
  );

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe = () => undefined;
    unobserve = () => undefined;
    disconnect = () => undefined;
  } as never;
});

describe('Vue dates, number, search and tree', () => {
  it('picks a day and emits it as an ISO date', async () => {
    const onUpdate = vi.fn();
    const view = mount(Calendar, {
      label: 'Delivery day',
      modelValue: '2026-11-10',
      'onUpdate:modelValue': onUpdate,
    });
    await settle();
    expect(
      view.container.querySelector('.ui-calendar__title')?.textContent,
    ).toMatch(/November 2026/);
    expect(
      view.container.querySelector('.ui-calendar__day--selected')?.textContent,
    ).toBe('10');
    day(view.container, '12')?.click();
    await settle();
    expect(onUpdate).toHaveBeenCalledWith('2026-11-12');
    view.unmount();
  });

  it('marks the middle of a range differently from its ends', async () => {
    const view = mount(RangeCalendar, {
      label: 'Stay',
      modelValue: { start: '2026-11-10', end: '2026-11-13' },
    });
    await settle();
    expect(
      view.container.querySelectorAll('.ui-calendar__day--selected'),
    ).toHaveLength(2);
    expect(
      view.container.querySelectorAll('.ui-calendar__day--in-range'),
    ).toHaveLength(2);
    view.unmount();
  });

  it('labels the date picker segments and its calendar button', async () => {
    const view = mount(DatePicker, {
      label: 'Visit date',
      calendarLabel: 'Choose date',
    });
    await settle();
    const group = view.container.querySelector('.ui-input-group');
    const label = view.container.querySelector('.ui-field__label');
    expect(group?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(
      view.container.querySelectorAll('.ui-date-input__segment').length,
    ).toBeGreaterThan(2);
    expect(
      view.container.querySelector('[aria-label="Choose date"]'),
    ).not.toBeNull();
    view.unmount();
  });

  it('steps the number field with the arrow keys and names its buttons', async () => {
    const onUpdate = vi.fn();
    const view = mount(NumberField, {
      label: 'Guests',
      modelValue: 2,
      'onUpdate:modelValue': onUpdate,
    });
    await settle();
    expect(
      view.container.querySelector('[aria-label="Increase"]'),
    ).not.toBeNull();
    const input = view.container.querySelector('input')!;
    expect(view.container.querySelector('label')?.getAttribute('for')).toBe(
      input.id,
    );
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    await settle();
    expect(onUpdate).toHaveBeenCalledWith(3);
    view.unmount();
  });

  it('clears the search with Escape and searches on Enter', async () => {
    const onUpdate = vi.fn();
    const onSearch = vi.fn();
    const view = mount(SearchField, {
      label: 'Search orders',
      modelValue: 'kofta',
      'onUpdate:modelValue': onUpdate,
      onSearch,
    });
    const input = view.container.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(onSearch).toHaveBeenCalledWith('kofta');
    expect(
      view.container.querySelector('[aria-label="Clear search"]'),
    ).not.toBeNull();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onUpdate).toHaveBeenCalledWith('');
    view.unmount();
  });

  it('renders the tree with levels and its open branch', async () => {
    const view = mount(Tree, {
      label: 'Menu',
      nodes: [
        {
          id: 'mains',
          label: 'Mains',
          children: [{ id: 'grill', label: 'Grill' }],
        },
        {
          id: 'drinks',
          label: 'Drinks',
          children: [{ id: 'tea', label: 'Tea' }],
        },
      ],
      defaultExpanded: ['mains'],
      selected: 'grill',
    });
    await settle();
    const items = [
      ...view.container.querySelectorAll<HTMLElement>('[role="treeitem"]'),
    ];
    expect(
      view.container.querySelector('[role="tree"]')?.getAttribute('aria-label'),
    ).toBe('Menu');
    expect(items.map((i) => i.textContent?.trim())).toEqual([
      'Mains',
      'Grill',
      'Drinks',
    ]);
    expect(items[1].style.getPropertyValue('--ui-tree-level')).toBe('1');
    expect(items[1].classList).toContain('ui-tree__item--selected');
    expect(items[0].classList).toContain('ui-tree__item--expanded');
    view.unmount();
  });
});
