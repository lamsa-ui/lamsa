import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import { Combobox, Menu, Select } from './select';

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

const key = (el: Element, key: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

const cities = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
];

beforeAll(() => {
  // jsdom lacks these; Reka's popups call them.
  Element.prototype.scrollIntoView ??= () => undefined;
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => undefined;
  globalThis.ResizeObserver ??= class {
    observe = () => undefined;
    unobserve = () => undefined;
    disconnect = () => undefined;
  } as never;
});

describe('Vue select, combobox and menu', () => {
  it('labels the select trigger and picks an option from the keyboard', async () => {
    const onUpdate = vi.fn();
    const view = mount(Select, {
      label: 'City',
      options: cities,
      placeholder: 'Choose',
      'onUpdate:modelValue': onUpdate,
    });
    const trigger = view.container.querySelector('button')!;
    const label = view.container.querySelector('label')!;
    expect(label.getAttribute('for')).toBe(trigger.id);
    trigger.focus();
    key(trigger, 'Enter');
    await settle();
    const options = document.querySelectorAll('.ui-listbox .ui-option');
    expect(options).toHaveLength(2);
    (options[1] as HTMLElement).focus();
    key(options[1], 'Enter');
    await settle();
    expect(onUpdate).toHaveBeenCalledWith('alx');
    view.unmount();
  });

  it('filters combobox options as you type and shows the empty text', async () => {
    const view = mount(Combobox, { label: 'Country', options: cities });
    const input = view.container.querySelector('input')!;
    input.focus();
    input.value = 'zz';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle();
    expect(document.querySelector('.ui-listbox__empty')?.textContent).toBe(
      'No matches',
    );
    view.unmount();
  });

  it('opens the menu and reports the chosen action', async () => {
    const onAction = vi.fn();
    const view = mount(Menu, {
      label: 'Actions',
      items: [
        { id: 'edit', label: 'Edit' },
        { id: 'delete', label: 'Delete', danger: true },
      ],
      onAction,
    });
    const trigger = view.container.querySelector('button')!;
    trigger.focus();
    key(trigger, 'Enter');
    await settle();
    const items = document.querySelectorAll('.ui-menu .ui-menu__item');
    expect(items).toHaveLength(2);
    expect(items[1].classList).toContain('ui-menu__item--danger');
    (items[1] as HTMLElement).click();
    await settle();
    expect(onAction).toHaveBeenCalledWith('delete');
    view.unmount();
  });
});
