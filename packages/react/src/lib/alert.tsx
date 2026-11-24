import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Button } from './button.js';
import { cx } from './class-names.js';
import { CloseIcon, ToneIcon, type AlertTone } from './tone-icon.js';

export interface AlertProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'title'
> {
  tone?: AlertTone;
  /** A few words in bold that say what it is ("Payment failed"). */
  title?: string;
  /** Buttons under the message. */
  actions?: ReactNode;
  /** Shows a close button; remove the alert when it is called. */
  onDismiss?: () => void;
  /** Accessible name of the close button; pass the translated text. */
  closeLabel?: string;
}

/**
 * A message in the page, such as a problem with the whole form. The title says the tone
 * in words; the icon and colour repeat it. It is not announced when the page loads: for a
 * message that appears after an action, pass `role="alert"` or `role="status"`, or use a toast.
 *
 * ```tsx
 * <Alert tone="warning" title="Your plan ends on 1 December">Renew it to keep your reports.</Alert>
 * ```
 */
export function Alert({
  tone = 'info',
  title,
  actions,
  onDismiss,
  closeLabel = 'Dismiss',
  className,
  children,
  ...div
}: AlertProps) {
  return (
    <div {...div} className={cx('ui-alert', `ui-alert--${tone}`, className)}>
      <ToneIcon tone={tone} className="ui-alert__icon" />
      <div className="ui-alert__body">
        {title && <p className="ui-alert__title">{title}</p>}
        {children}
        {actions && <div className="ui-alert__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          className="ui-alert__close"
          aria-label={closeLabel}
          onClick={onDismiss}
        >
          <CloseIcon />
        </Button>
      )}
    </div>
  );
}
