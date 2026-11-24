import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import { Alert, Button, Checkbox, PhoneField, TextField } from './components';
import { Icon } from './content';

function mount(
  component: Component,
  props: Record<string, unknown> = {},
  slots: Record<string, () => string> = {},
) {
  const container = document.createElement('div');
  const app = createApp(
    defineComponent({
      setup: () => () => h(component, props, slots),
    }),
  );
  app.mount(container);
  return {
    container,
    unmount: () => app.unmount(),
  };
}

describe('Vue core controls', () => {
  it('renders a loading button as disabled and busy', () => {
    const view = mount(Button, { loading: true }, { default: () => 'Save' });
    const button = view.container.querySelector('button');

    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(
      button?.querySelector('.ui-spinner[aria-hidden="true"]'),
    ).not.toBeNull();
    expect(button?.textContent).toContain('Save');
    view.unmount();
  });

  it('associates text field label, hint and error and emits v-model updates', () => {
    const onUpdate = vi.fn();
    const view = mount(TextField, {
      label: 'Email',
      hint: 'Work address',
      error: 'Invalid address',
      id: 'email',
      'onUpdate:modelValue': onUpdate,
    });
    const input = view.container.querySelector('input');

    expect(view.container.querySelector('label')?.htmlFor).toBe('email');
    expect(input?.getAttribute('aria-describedby')).toBe(
      'email-hint email-error',
    );
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    if (!input) throw new Error('TextField input was not rendered');
    input.value = 'person@example.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(onUpdate).toHaveBeenCalledWith('person@example.com');
    view.unmount();
  });

  it('emits checkbox state and preserves its native label hit area', () => {
    const onUpdate = vi.fn();
    const view = mount(Checkbox, {
      label: 'Accept terms',
      'onUpdate:modelValue': onUpdate,
    });
    const input = view.container.querySelector('input');

    expect(input?.closest('label')?.textContent).toContain('Accept terms');
    if (!input) throw new Error('Checkbox input was not rendered');
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(onUpdate).toHaveBeenCalledWith(true);
    view.unmount();
  });

  it('normalizes phone input to E.164 and supports v-model updates', async () => {
    const onUpdate = vi.fn();
    const view = mount(PhoneField, {
      label: 'Mobile',
      country: 'EG',
      modelValue: null,
      name: 'phone',
      'onUpdate:modelValue': onUpdate,
    });
    const input = view.container.querySelector('input[type="tel"]');
    if (!input) throw new Error('Phone number input was not rendered');

    input.value = '010 1234 5678';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();

    expect(onUpdate).toHaveBeenCalledWith('+201012345678');
    expect(
      (view.container.querySelector('input[type="hidden"]') as HTMLInputElement)
        ?.value,
    ).toBe('+201012345678');
    view.unmount();
  });

  it('supports an alert role and tone class', () => {
    const view = mount(
      Alert,
      { tone: 'danger', role: 'alert' },
      { default: () => 'Could not save' },
    );
    const alert = view.container.firstElementChild;

    expect(alert?.getAttribute('role')).toBe('alert');
    expect(alert?.classList.contains('ui-alert--danger')).toBe(true);
    view.unmount();
  });

  it('shows a named close button on an alert only with @dismiss', () => {
    const onDismiss = vi.fn();
    const view = mount(
      Alert,
      { tone: 'warning', title: 'Plan ends', closeLabel: 'Close', onDismiss },
      { default: () => 'Renew it.', actions: () => h('button', 'Renew') },
    );
    expect(view.container.querySelector('.ui-alert__icon')).not.toBeNull();
    expect(
      view.container.querySelector('.ui-alert__actions button')?.textContent,
    ).toBe('Renew');
    const close = view.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Close"]',
    );
    close?.click();
    expect(onDismiss).toHaveBeenCalledOnce();
    view.unmount();

    const plain = mount(Alert, { title: 'Note' });
    expect(plain.container.querySelector('button')).toBeNull();
    plain.unmount();
  });

  it('sets an indeterminate checkbox', () => {
    const view = mount(Checkbox, { label: 'All files', indeterminate: true });
    expect(view.container.querySelector('input')?.indeterminate).toBe(true);
    view.unmount();
  });

  it('wraps button icon slots as hidden decoration', () => {
    const view = mount(
      Button,
      {},
      {
        default: () => 'Next',
        endIcon: () => h(Icon, { name: 'arrow-right' }),
      },
    );
    const icon = view.container.querySelector('.ui-button__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.querySelector('svg')).not.toBeNull();
    view.unmount();
  });
});
