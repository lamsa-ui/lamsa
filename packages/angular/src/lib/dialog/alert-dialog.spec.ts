import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiAlertDialog } from './alert-dialog';

const stable = () => TestBed.inject(ApplicationRef).whenStable();
const alertEl = () =>
  document.querySelector<HTMLElement>('[role="alertdialog"]');
const action = (index: number) =>
  alertEl()!.querySelector<HTMLButtonElement>(
    `[data-testid="ui-alert-action-${index}"]`,
  )!;

describe('UiAlertDialog', () => {
  afterEach(() => document.body.replaceChildren());

  async function confirmDelete() {
    const answer = TestBed.inject(UiAlertDialog).confirm({
      title: 'Delete report.pdf?',
      message: 'This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    });
    await stable();
    return answer;
  }

  it('asks in an alert dialog described by its message, with focus on Cancel', async () => {
    const answer = confirmDelete();
    await stable();
    const dialog = alertEl()!;

    const description = document.getElementById(
      dialog.getAttribute('aria-describedby')!,
    );
    expect(description?.textContent?.trim()).toBe('This cannot be undone.');
    expect(dialog.querySelector('[data-testid="ui-dialog-close"]')).toBeNull();
    expect(
      dialog
        .querySelector('.ui-dialog__icon--danger')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(document.activeElement?.textContent?.trim()).toBe('Cancel');

    action(1).click();
    expect(await answer).toBe(true);
  });

  it('resolves false on Cancel, and ignores Escape and the backdrop', async () => {
    const cancelled = confirmDelete();
    await stable();
    action(0).click();
    expect(await cancelled).toBe(false);

    confirmDelete();
    await stable();
    document.querySelector<HTMLElement>('.cdk-overlay-backdrop')!.click();
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        keyCode: 27,
        bubbles: true,
      }),
    );
    await stable();
    expect(alertEl()).not.toBeNull();
  });

  it('resolves with the value of the chosen action and focuses the marked one', async () => {
    const choice = TestBed.inject(UiAlertDialog).alert({
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
    });
    await stable();

    expect(
      alertEl()!.querySelector('.ui-dialog__icon--warning'),
    ).not.toBeNull();
    expect(document.activeElement).toBe(action(2));

    action(0).click();
    expect(await choice).toBe('discard');
  });
});
