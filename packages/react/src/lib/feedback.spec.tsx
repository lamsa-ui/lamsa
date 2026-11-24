import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './alert.js';
import { Progress, Skeleton, Spinner } from './loading.js';
import { ToastProvider, useToast, type ToastOptions } from './toast.js';

describe('Alert', () => {
  it('shows its tone and title, and a named close button', async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <Alert tone="danger" title="Payment failed" onDismiss={onDismiss}>
        The card was declined.
      </Alert>,
    );
    expect(container.firstElementChild?.classList).toContain(
      'ui-alert--danger',
    );
    expect(screen.getByText('Payment failed')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe('Spinner, Progress and Skeleton', () => {
  it('names the spinner and the progress bar', () => {
    render(
      <>
        <Spinner label="Loading orders" />
        <Progress label="Uploading" value={40} />
        <Progress label="Preparing" />
      </>,
    );
    expect(screen.getByRole('status').textContent).toBe('Loading orders');
    const upload = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(upload.getAttribute('value')).toBe('40');
    expect(screen.getByText(/40/)).toBeTruthy();
    expect(
      screen
        .getByRole('progressbar', { name: 'Preparing' })
        .hasAttribute('value'),
    ).toBe(false);
  });

  it('hides the skeleton from screen readers', () => {
    const { container } = render(<Skeleton lines={3} />);
    const skeleton = container.firstElementChild!;
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.querySelectorAll('.ui-skeleton__shape')).toHaveLength(3);
  });
});

describe('Toast', () => {
  afterEach(() => vi.useRealTimers());

  function setup() {
    let api: ReturnType<typeof useToast> | undefined;
    function Grab() {
      api = useToast();
      return null;
    }
    render(
      <ToastProvider>
        <Grab />
      </ToastProvider>,
    );
    const show = (message: string, options?: ToastOptions) =>
      act(() => {
        api?.show(message, options);
      });
    const items = () => screen.queryAllByTestId('ui-toast');
    return { show, items };
  }

  it('shows the toast in a named region and announces it', () => {
    const { show, items } = setup();
    show('Address saved', { tone: 'success', title: 'Done' });
    expect(items()).toHaveLength(1);
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeTruthy();
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe(
      'Done. Address saved',
    );

    show('Payment failed', { tone: 'danger' });
    expect(
      document.querySelector('[aria-live="assertive"]')?.textContent?.trim(),
    ).toBe('Payment failed');
  });

  it('closes after its time and keeps toasts with an action', () => {
    vi.useFakeTimers();
    const { show, items } = setup();
    show('Saved');
    show('Order deleted', { action: { label: 'Undo', run: () => undefined } });
    expect(items()).toHaveLength(2);
    act(() => vi.advanceTimersByTime(6_000));
    expect(items().map((i) => i.textContent)).toEqual([
      expect.stringContaining('Order deleted'),
    ]);
  });

  it('runs the action and closes', async () => {
    const run = vi.fn();
    const { show, items } = setup();
    show('Order deleted', { action: { label: 'Undo', run } });
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(run).toHaveBeenCalled();
    expect(items()).toHaveLength(0);
  });
});
