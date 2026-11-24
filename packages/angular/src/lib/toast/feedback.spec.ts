import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AlertComponent } from '../alert/alert.component';
import { ProgressComponent } from '../progress/progress.component';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { UiToast } from './toast';

@Component({
  imports: [
    AlertComponent,
    SpinnerComponent,
    ProgressComponent,
    SkeletonComponent,
  ],
  template: `
    <ui-alert
      tone="danger"
      title="Payment failed"
      [dismissible]="true"
      (dismiss)="dismissed.set(true)"
    >
      The card was declined.
    </ui-alert>
    <ui-spinner label="Loading orders" />
    <ui-progress label="Uploading" [value]="value()" testId="upload" />
    <ui-skeleton [lines]="3" />
  `,
})
class HostComponent {
  readonly dismissed = signal(false);
  readonly value = signal<number | undefined>(40);
}

describe('alert, spinner, progress and skeleton', () => {
  async function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    return {
      fixture,
      root: fixture.nativeElement as HTMLElement,
      host: fixture.componentInstance,
    };
  }

  it('shows the alert with its tone, title and a named close button', async () => {
    const { root, host } = await setup();
    const alert = root.querySelector('ui-alert')!;
    expect(alert.classList).toContain('ui-alert--danger');
    expect(alert.querySelector('.ui-alert__title')?.textContent).toBe(
      'Payment failed',
    );
    const icon = alert.querySelector('.ui-alert__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.classList).toContain('ui-icon');
    const close = alert.querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss"]',
    )!;
    close.click();
    expect(host.dismissed()).toBe(true);
  });

  it('gives the spinner a status role and a name', async () => {
    const { root } = await setup();
    const spinner = root.querySelector('ui-spinner')!;
    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.textContent?.trim()).toBe('Loading orders');
  });

  it('names the progress bar, shows the percentage and goes indeterminate without a value', async () => {
    const { fixture, root, host } = await setup();
    const bar = root.querySelector<HTMLProgressElement>(
      '[data-testid="upload"]',
    )!;
    expect(
      document.getElementById(bar.getAttribute('aria-labelledby')!)
        ?.textContent,
    ).toBe('Uploading');
    expect(bar.getAttribute('value')).toBe('40');
    expect(root.querySelector('.ui-progress__value')?.textContent).toContain(
      '40',
    );

    host.value.set(undefined);
    await fixture.whenStable();
    expect(bar.hasAttribute('value')).toBe(false);
  });

  it('hides the skeleton from screen readers', async () => {
    const { root } = await setup();
    const skeleton = root.querySelector('ui-skeleton')!;
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.querySelectorAll('.ui-skeleton__shape')).toHaveLength(3);
  });
});

describe('UiToast', () => {
  afterEach(() => vi.useRealTimers());

  function setup() {
    vi.useFakeTimers();
    const announce = vi.fn().mockResolvedValue(undefined);
    TestBed.configureTestingModule({
      providers: [{ provide: LiveAnnouncer, useValue: { announce } }],
    });
    const toast = TestBed.inject(UiToast);
    const render = () => TestBed.tick();
    const items = () =>
      Array.from(document.querySelectorAll('[data-testid="ui-toast"]'));
    return { toast, announce, render, items };
  }

  it('shows a toast in a named region and announces it', () => {
    const { toast, announce, render, items } = setup();
    toast.show('Address saved', { tone: 'success', title: 'Done' });
    render();

    expect(items()).toHaveLength(1);
    expect(items()[0].textContent).toContain('Address saved');
    const region = document.querySelector('ui-toast-region')!;
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-label')).toBe('Notifications');
    expect(announce).toHaveBeenCalledWith('Done. Address saved', 'polite');

    toast.show('Payment failed', { tone: 'danger' });
    expect(announce).toHaveBeenLastCalledWith('Payment failed', 'assertive');
  });

  it('closes after its time, but not while paused, and keeps toasts with an action', () => {
    const { toast, render, items } = setup();
    toast.show('Saved');
    toast.show('Order deleted', {
      action: { label: 'Undo', run: () => undefined },
    });
    render();
    expect(items()).toHaveLength(2);

    toast.pause();
    vi.advanceTimersByTime(10_000);
    render();
    expect(items()).toHaveLength(2);

    toast.resume();
    vi.advanceTimersByTime(6_000);
    render();
    expect(items().map((i) => i.textContent)).toEqual([
      expect.stringContaining('Order deleted'),
    ]);
  });

  it('runs the action and closes', () => {
    const { toast, render, items } = setup();
    const run = vi.fn();
    toast.show('Order deleted', { action: { label: 'Undo', run } });
    render();
    const undo = Array.from(items()[0].querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Undo',
    )!;
    undo.click();
    render();
    expect(run).toHaveBeenCalled();
    expect(items()).toHaveLength(0);
  });
});
