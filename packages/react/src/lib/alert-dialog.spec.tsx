import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAlertDialog, type AlertOptions } from './alert-dialog.js';
import { Button } from './button.js';

function ConfirmHost({ onAnswer }: { onAnswer: (value: boolean) => void }) {
  const { confirm, dialog } = useAlertDialog();
  return (
    <>
      {dialog}
      <Button
        type="button"
        onClick={async () =>
          onAnswer(
            await confirm({
              title: 'Delete report.pdf?',
              message: 'This cannot be undone.',
              confirmLabel: 'Delete',
              danger: true,
            }),
          )
        }
      >
        Delete file
      </Button>
    </>
  );
}

function AlertHost({
  options,
  onAnswer,
}: {
  options: AlertOptions<string>;
  onAnswer: (value: string | undefined) => void;
}) {
  const { alert, dialog } = useAlertDialog();
  return (
    <>
      {dialog}
      <Button
        type="button"
        onClick={async () => onAnswer(await alert(options))}
      >
        Leave
      </Button>
    </>
  );
}

describe('useAlertDialog', () => {
  it('confirms in an alert dialog described by its message, with focus on Cancel', async () => {
    const onAnswer = vi.fn();
    render(<ConfirmHost onAnswer={onAnswer} />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete file' }));

    const dialog = screen.getByRole('alertdialog', {
      name: 'Delete report.pdf?',
    });
    expect(
      document.getElementById(dialog.getAttribute('aria-describedby')!)
        ?.textContent,
    ).toBe('This cannot be undone.');
    expect(screen.queryByTestId('ui-dialog-close')).toBeNull();
    expect(
      dialog
        .querySelector('.ui-dialog__icon--danger')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(document.activeElement?.textContent).toBe('Cancel');

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(onAnswer).toHaveBeenCalledWith(true));
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('answers false on Cancel, ignores Escape, and returns focus', async () => {
    const onAnswer = vi.fn();
    render(<ConfirmHost onAnswer={onAnswer} />);
    const opener = screen.getByRole('button', { name: 'Delete file' });

    await userEvent.click(opener);
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).not.toBeNull();
    expect(onAnswer).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(onAnswer).toHaveBeenLastCalledWith(false));
    await waitFor(() => expect(document.activeElement).toBe(opener));
  });

  it('answers the chosen action and focuses the marked one', async () => {
    const onAnswer = vi.fn();
    render(
      <AlertHost
        onAnswer={onAnswer}
        options={{
          title: 'Unsaved changes',
          message: 'Save them before you leave?',
          tone: 'warning',
          actions: [
            { label: 'Discard', value: 'discard', variant: 'danger' },
            { label: 'Keep editing', value: 'stay' },
            {
              label: 'Save',
              value: 'save',
              variant: 'primary',
              initialFocus: true,
            },
          ],
        }}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Leave' }));

    expect(document.querySelector('.ui-dialog__icon--warning')).not.toBeNull();
    expect(document.activeElement?.textContent).toBe('Save');

    await userEvent.click(screen.getByRole('button', { name: 'Discard' }));
    await waitFor(() => expect(onAnswer).toHaveBeenCalledWith('discard'));
  });
});
