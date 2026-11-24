import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StepComponent, StepperComponent } from './stepper.component';

@Component({
  imports: [StepperComponent, StepComponent],
  template: `<ui-stepper
    label="Checkout"
    linear
    [(current)]="current"
    (blocked)="blocked = $event"
    (finish)="finished = true"
  >
    <ui-step label="Cart">cart</ui-step>
    <ui-step label="Address" [completed]="addressValid()">address</ui-step>
    <ui-step label="Pay">pay</ui-step>
  </ui-stepper>`,
})
class HostComponent {
  current = 0;
  addressValid = signal(false);
  blocked = -1;
  finished = false;
}

describe('StepperComponent', () => {
  it('moves through the steps, waits for incomplete ones and finishes', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    const host = fixture.componentInstance;
    const el: HTMLElement = fixture.nativeElement;
    await fixture.whenStable();

    const list = el.querySelector('ol')!;
    expect(list.getAttribute('aria-label')).toBe('Checkout');
    const steps = () => [
      ...el.querySelectorAll<HTMLButtonElement>('.ui-steps__step'),
    ];
    const visible = () =>
      el.querySelector('.ui-stepper__panel:not([hidden])')!.textContent!.trim();
    const action = (text: string) =>
      [
        ...el.querySelectorAll<HTMLButtonElement>(
          '.ui-stepper__actions button',
        ),
      ].find((b) => b.textContent!.trim() === text)!;

    expect(visible()).toBe('cart');
    expect(steps()[2].disabled).toBe(true);

    action('Next').click();
    await fixture.whenStable();
    expect(host.current).toBe(1);
    expect(visible()).toBe('address');
    expect(steps()[0].textContent!.replace(/\s+/g, ' ').trim()).toBe(
      'Done: Cart',
    );
    expect(steps()[1].getAttribute('aria-current')).toBe('step');

    action('Next').click();
    await fixture.whenStable();
    expect(host.current).toBe(1);
    expect(host.blocked).toBe(1);

    host.addressValid.set(true);
    await fixture.whenStable();
    expect(steps()[2].disabled).toBe(false);
    action('Next').click();
    await fixture.whenStable();
    action('Finish').click();
    expect(host.finished).toBe(true);

    steps()[0].click();
    await fixture.whenStable();
    expect(visible()).toBe('cart');
  });
});
