'use client';

import { useCallback, useState } from 'react';
import { Button, type ButtonVariant } from './button.js';
import { Dialog } from './dialog.js';
import { ToneIcon, type AlertTone } from './tone-icon.js';

export type { AlertTone } from './tone-icon.js';

export interface AlertAction<R> {
  /** The translated text of the button. */
  label: string;
  /** What `onAction` (or `alert()`) receives when this button is pressed. */
  value: R;
  variant?: ButtonVariant;
  /** Focus starts here. Without it, focus starts on the first non-danger action. */
  initialFocus?: boolean;
}

export interface AlertOptions<R> {
  title: string;
  /** What happened or what will happen; read with the title. Plain text. */
  message: string;
  /** Shown as an icon; the title must say it in words too. */
  tone?: AlertTone;
  /** One to three buttons, in reading order. */
  actions: readonly AlertAction<R>[];
}

export interface ConfirmOptions {
  title: string;
  message: string;
  /** The translated text of the confirm button. */
  confirmLabel: string;
  /** The translated text of the cancel button. */
  cancelLabel?: string;
  /** For actions that destroy something: danger tone and button, and focus starts on Cancel. */
  danger?: boolean;
}

export interface AlertDialogProps<R> extends AlertOptions<R> {
  open: boolean;
  /** The value of the pressed action; `undefined` only if the app closes it. */
  onAction: (value: R | undefined) => void;
}

function initialFocusIndex<R>(actions: readonly AlertAction<R>[]): number {
  const marked = actions.findIndex((a) => a.initialFocus);
  if (marked !== -1) return marked;
  const safe = actions.findIndex((a) => a.variant !== 'danger');
  return safe === -1 ? 0 : safe;
}

/**
 * A message that needs an answer: `role="alertdialog"`, only its buttons answer
 * (never Escape or a click outside), and focus starts on the safest button.
 */
export function AlertDialog<R>({
  open,
  title,
  message,
  tone,
  actions,
  onAction,
}: AlertDialogProps<R>) {
  const focusIndex = initialFocusIndex(actions);
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onAction(undefined)}
      role="alertdialog"
      variant="alert"
      size="sm"
      title={title}
      description={message}
      icon={
        tone && (
          <span
            className={`ui-dialog__icon ui-dialog__icon--${tone}`}
            aria-hidden="true"
          >
            <ToneIcon tone={tone} />
          </span>
        )
      }
      actions={actions.map((action, index) => (
        <Button
          key={index}
          type="button"
          variant={action.variant ?? 'secondary'}
          // The alert dialog pattern starts focus on the safest answer.
          autoFocus={index === focusIndex}
          data-testid={`ui-alert-action-${index}`}
          onClick={() => onAction(action.value)}
        >
          {action.label}
        </Button>
      ))}
    />
  );
}

/**
 * Promise-based alerts. Render `dialog` once in the component, then await `alert()`
 * or `confirm()` from any handler.
 *
 * ```tsx
 * const { confirm, dialog } = useAlertDialog();
 * async function remove() {
 *   if (await confirm({ title: 'Delete report.pdf?', message: '...', confirmLabel: 'Delete', danger: true })) { ... }
 * }
 * return <>{dialog}<Button onClick={remove}>Delete</Button></>;
 * ```
 */
export function useAlertDialog() {
  const [request, setRequest] = useState<{
    options: AlertOptions<unknown>;
    resolve: (value: unknown) => void;
  } | null>(null);

  const alert = useCallback(
    <R,>(options: AlertOptions<R>) =>
      new Promise<R | undefined>((resolve) =>
        setRequest({
          options,
          resolve: resolve as (value: unknown) => void,
        }),
      ),
    [],
  );

  const confirm = useCallback(
    async (options: ConfirmOptions) =>
      (await alert<boolean>({
        title: options.title,
        message: options.message,
        tone: options.danger ? 'danger' : undefined,
        actions: [
          {
            label: options.cancelLabel ?? 'Cancel',
            value: false,
            variant: 'secondary',
          },
          {
            label: options.confirmLabel,
            value: true,
            variant: options.danger ? 'danger' : 'primary',
            initialFocus: !options.danger,
          },
        ],
      })) === true,
    [alert],
  );

  const dialog = request && (
    <AlertDialog
      open
      {...request.options}
      onAction={(value) => {
        request.resolve(value);
        setRequest(null);
      }}
    />
  );

  return { alert, confirm, dialog };
}
