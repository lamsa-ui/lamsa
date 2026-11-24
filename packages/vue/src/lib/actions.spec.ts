import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import { Meter, Toggle, Toolbar, toolbarStep } from './actions';
import { TextField } from './components';
import { AvatarGroup } from './content';

function mount(
  component: Component,
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  const container = document.createElement('div');
  document.body.append(container);
  const app = createApp(
    defineComponent({ setup: () => () => h(component, props, slots) }),
  );
  app.mount(container);
  return { container, unmount: () => (app.unmount(), container.remove()) };
}

describe('Vue new components', () => {
  it('steps through a toolbar, flipped right to left', () => {
    expect(toolbarStep('ArrowRight', 0, 3, 'horizontal', true)).toBe(2);
    expect(toolbarStep('Home', 2, 3, 'horizontal', false)).toBe(0);
  });

  it('keeps one tab stop in a toolbar and moves it with the arrows', async () => {
    const view = mount(
      Toolbar,
      { label: 'Note' },
      {
        default: () => [
          h('button', { type: 'button' }, 'Undo'),
          h('button', { type: 'button' }, 'Redo'),
        ],
      },
    );
    await nextTick();
    const [undo, redo] = [
      ...view.container.querySelectorAll('button'),
    ] as HTMLElement[];
    expect([undo.tabIndex, redo.tabIndex]).toEqual([0, -1]);
    undo.focus();
    undo.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(document.activeElement).toBe(redo);
    view.unmount();
  });

  it('toggles and emits the new state', async () => {
    const changes: boolean[] = [];
    const view = mount(
      Toggle,
      { 'onUpdate:pressed': (on: boolean) => changes.push(on) },
      { default: () => 'Pin' },
    );
    const button = view.container.querySelector('button')!;
    button.click();
    await nextTick();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(changes).toEqual([true]);
    view.unmount();
  });

  it('renders a meter, an avatar overflow and a prefixed field', () => {
    const view = mount(Meter, { label: 'Score', value: 50 });
    expect(
      view.container
        .querySelector('[role="meter"]')
        ?.getAttribute('aria-valuenow'),
    ).toBe('50');
    view.unmount();

    const group = mount(AvatarGroup, {
      label: 'Team',
      max: 1,
      people: [{ name: 'A B' }, { name: 'C D' }],
    });
    expect(
      group.container
        .querySelector('.ui-avatar-group__more')
        ?.getAttribute('aria-label'),
    ).toBe('1 more');
    group.unmount();

    const field = mount(TextField, { label: 'Weight', suffix: 'kg' });
    const input = field.container.querySelector('input')!;
    expect(input.className).toBe('ui-input-group__input');
    expect(input.getAttribute('aria-describedby')).toContain('-suffix');
    field.unmount();
  });
});
