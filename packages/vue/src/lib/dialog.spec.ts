import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import { Dialog, useAlertDialog } from './dialog';

function mount(
  component: Component,
  props: Record<string, unknown> = {},
  slots = {},
) {
  const container = document.createElement('div');
  document.body.append(container);
  const app = createApp(
    defineComponent({ setup: () => () => h(component, props, slots) }),
  );
  app.mount(container);
  return () => {
    app.unmount();
    container.remove();
  };
}

const settle = async () => {
  await nextTick();
  await new Promise((r) => setTimeout(r, 0));
  await nextTick();
};

const escape = () =>
  document.activeElement?.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  ) ?? document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

describe('Vue dialog', () => {
  it('renders a titled, described dialog inside the backdrop and closes on Escape', async () => {
    const onUpdate = vi.fn();
    const unmount = mount(
      Dialog,
      {
        open: true,
        title: 'Edit address',
        description: 'Where we deliver',
        'onUpdate:open': onUpdate,
      },
      { default: () => h('input', { 'aria-label': 'Street' }) },
    );
    await settle();
    const dialog = document.querySelector('.ui-dialog-backdrop > .ui-dialog');
    expect(dialog?.getAttribute('role')).toBe('dialog');
    const title = dialog?.querySelector('.ui-dialog__title');
    expect(dialog?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(dialog?.getAttribute('aria-describedby')).toBe(
      dialog?.querySelector('.ui-dialog__description')?.id,
    );
    expect(dialog?.querySelector('[aria-label="Close"]')).not.toBeNull();
    escape();
    await settle();
    expect(onUpdate).toHaveBeenCalledWith(false);
    unmount();
  });

  it('keeps an alert dialog open on Escape, focuses the safe answer and resolves confirm()', async () => {
    let api!: ReturnType<typeof useAlertDialog>;
    const unmount = mount(
      defineComponent({
        setup() {
          api = useAlertDialog();
          return () => h(api.dialog);
        },
      }),
    );
    const answer = api.confirm({
      title: 'Delete file?',
      message: 'It cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    await settle();
    const dialog = document.querySelector('.ui-dialog');
    expect(dialog?.getAttribute('role')).toBe('alertdialog');
    expect(dialog?.querySelector('[aria-label="Close"]')).toBeNull();
    expect(document.activeElement?.textContent).toBe('Cancel');
    escape();
    await settle();
    expect(document.querySelector('.ui-dialog')).not.toBeNull();
    (
      document.querySelector(
        '[data-testid="ui-alert-action-1"]',
      ) as HTMLButtonElement
    ).click();
    expect(await answer).toBe(true);
    await settle();
    expect(document.querySelector('.ui-dialog')).toBeNull();
    unmount();
  });
});
