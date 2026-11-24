import { fireEvent, render, screen } from '@testing-library/react';
import { Stepper, type StepItem } from './stepper.js';

describe('Stepper', () => {
  it('moves through the steps, waits for incomplete ones and finishes', () => {
    const onBlocked = vi.fn();
    const onFinish = vi.fn();
    const steps = (addressValid: boolean): StepItem[] => [
      { label: 'Cart', content: 'cart' },
      { label: 'Address', content: 'address', completed: addressValid },
      { label: 'Pay', content: 'pay' },
    ];
    const ui = (addressValid: boolean) => (
      <Stepper
        label="Checkout"
        linear
        steps={steps(addressValid)}
        onBlocked={onBlocked}
        onFinish={onFinish}
      />
    );
    const { container, rerender } = render(ui(false));
    const visible = () =>
      container.querySelector('.ui-stepper__panel:not([hidden])')!.textContent;
    const step = (name: RegExp) => screen.getByRole('button', { name });

    expect(screen.getByRole('list', { name: 'Checkout' })).toBeTruthy();
    expect(visible()).toBe('cart');
    expect((step(/Pay/) as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(visible()).toBe('address');
    expect(step(/Cart/).textContent).toBe('Done: Cart');
    expect(step(/Address/).getAttribute('aria-current')).toBe('step');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onBlocked).toHaveBeenCalledWith(1);
    expect(visible()).toBe('address');

    rerender(ui(true));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(onFinish).toHaveBeenCalled();

    fireEvent.click(step(/Cart/));
    expect(visible()).toBe('cart');
  });
});
