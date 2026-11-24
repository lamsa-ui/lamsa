import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button } from './button.js';
import { Dialog, type DialogProps } from './dialog.js';

function Host(props: Partial<DialogProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Edit address
      </Button>
      <Dialog
        title="Edit address"
        description="Used for your next orders."
        size="lg"
        open={open}
        onOpenChange={setOpen}
        actions={
          <Button type="button" onClick={() => setOpen(false)}>
            Save
          </Button>
        }
        {...props}
      >
        <p>Body</p>
      </Dialog>
    </>
  );
}

async function open(props: Partial<DialogProps> = {}) {
  render(<Host {...props} />);
  const opener = screen.getByRole('button', { name: 'Edit address' });
  await userEvent.click(opener);
  return { opener, dialog: screen.getByRole('dialog') };
}

describe('Dialog', () => {
  it('names and describes the dialog, with focus inside', async () => {
    const { dialog } = await open();
    const description = screen.getByText('Used for your next orders.');

    expect(screen.getByRole('dialog', { name: 'Edit address' })).toBe(dialog);
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('applies the size and keeps actions out of the scrolling body', async () => {
    const { dialog } = await open();
    expect(dialog.className).toBe('ui-dialog ui-dialog--lg');
    expect(dialog.querySelector('.ui-dialog__body p')).not.toBeNull();
    expect(dialog.querySelector('.ui-dialog__actions')?.textContent).toBe(
      'Save',
    );
  });

  it.each(['drawer', 'sheet'] as const)(
    'docks to the edge as a %s',
    async (variant) => {
      const { dialog } = await open({ variant });
      expect(dialog.className).toBe(
        `ui-dialog ui-dialog--lg ui-dialog--${variant}`,
      );
    },
  );

  it('closes from the close button and returns focus to the opener', async () => {
    const { opener } = await open();
    await userEvent.click(screen.getByTestId('ui-dialog-close'));

    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(opener));
  });

  it('closes on Escape', async () => {
    await open();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it.each([
    [true, 'closes'],
    [false, 'stays open'],
  ])(
    'with dismissable %s, a click outside %s',
    async (dismissable, outcome) => {
      await open({ dismissable });
      await userEvent.click(document.querySelector('.ui-dialog-backdrop')!);
      expect(screen.queryByRole('dialog') === null).toBe(outcome === 'closes');
    },
  );

  it('stays open when not dismissable, without a close button', async () => {
    await open({ dismissable: false });
    expect(screen.queryByTestId('ui-dialog-close')).toBeNull();

    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).not.toBeNull();
  });
});
