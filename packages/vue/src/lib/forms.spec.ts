import { createApp, defineComponent, h, nextTick, type Component } from 'vue';
import {
  Fieldset,
  PinInput,
  Rating,
  SegmentedControl,
  Slider,
  Stepper,
} from './forms';

function mount(
  component: Component,
  props: Record<string, unknown> = {},
  slots: Record<string, (...args: never[]) => unknown> = {},
) {
  const container = document.createElement('div');
  document.body.append(container);
  const app = createApp(
    defineComponent({ setup: () => () => h(component, props, slots) }),
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

describe('Vue form controls', () => {
  it('describes a fieldset by its hint', () => {
    const view = mount(Fieldset, {
      legend: 'Address',
      hint: 'Where we deliver',
    });
    const fieldset = view.container.querySelector('fieldset');
    const hint = view.container.querySelector('.ui-field__hint');
    expect(fieldset?.getAttribute('aria-describedby')).toBe(hint?.id);
    view.unmount();
  });

  it('formats the slider value for screen readers and emits numbers', async () => {
    const onUpdate = vi.fn();
    const view = mount(Slider, {
      label: 'Price',
      modelValue: 500,
      max: 2000,
      format: (v: number) => `EGP ${v}`,
      'onUpdate:modelValue': onUpdate,
    });
    const input = view.container.querySelector('input');
    expect(input?.getAttribute('aria-valuetext')).toBe('EGP 500');
    input!.value = '550';
    input!.dispatchEvent(new Event('input'));
    await nextTick();
    expect(onUpdate).toHaveBeenCalledWith(550);
    view.unmount();
  });

  it('rates with radios and reads a score aloud when read-only', () => {
    const onUpdate = vi.fn();
    const view = mount(Rating, {
      label: 'Food',
      'onUpdate:modelValue': onUpdate,
    });
    const radios = view.container.querySelectorAll('input[type="radio"]');
    expect(radios).toHaveLength(5);
    (radios[3] as HTMLInputElement).click();
    expect(onUpdate).toHaveBeenCalledWith(4);
    view.unmount();

    const shown = mount(Rating, { readOnly: true, modelValue: 4 });
    expect(shown.container.firstElementChild?.getAttribute('aria-label')).toBe(
      '4 out of 5 stars',
    );
    shown.unmount();
  });

  it('picks a segment', () => {
    const onUpdate = vi.fn();
    const view = mount(SegmentedControl, {
      label: 'View',
      options: [
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
      ],
      modelValue: 'list',
      'onUpdate:modelValue': onUpdate,
    });
    expect(
      view.container
        .querySelector('[role="radiogroup"]')
        ?.getAttribute('aria-label'),
    ).toBe('View');
    (view.container.querySelectorAll('input')[1] as HTMLInputElement).click();
    expect(onUpdate).toHaveBeenCalledWith('grid');
    view.unmount();
  });

  it('fills the PIN from a paste of Arabic digits and reports completion', async () => {
    const onComplete = vi.fn();
    const view = mount(PinInput, { label: 'Code', length: 4, onComplete });
    const first = view.container.querySelector('input')!;
    first.value = '١٢٣٤';
    first.dispatchEvent(new Event('input'));
    await nextTick();
    expect(onComplete).toHaveBeenCalledWith('1234');
    expect(
      [...view.container.querySelectorAll('input')].map(
        (i) => (i as HTMLInputElement).value,
      ),
    ).toEqual(['1', '2', '3', '4']);
    view.unmount();
  });

  it('shows one stepper panel and blocks an incomplete linear step', async () => {
    const onBlocked = vi.fn();
    const view = mount(
      Stepper,
      {
        label: 'Checkout',
        steps: [{ label: 'Cart', completed: false }, { label: 'Pay' }],
        linear: true,
        onBlocked,
      },
      { panel: ({ step }: { step: { label: string } }) => h('p', step.label) },
    );
    const panels = view.container.querySelectorAll('section');
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(true);
    expect(panels[0].textContent).toBe('Cart');
    const next = [...view.container.querySelectorAll('button')].find(
      (b) => b.textContent === 'Next',
    );
    next?.click();
    await nextTick();
    expect(onBlocked).toHaveBeenCalledWith(0);
    expect(
      view.container
        .querySelectorAll('.ui-steps__step')[1]
        .hasAttribute('disabled'),
    ).toBe(true);
    view.unmount();
  });
});
