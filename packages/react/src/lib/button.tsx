import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from './class-names.js';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'outline'
  | 'soft'
  | 'link'
  | 'success'
  | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Disables the button, marks it busy for screen readers and shows a spinner. */
  loading?: boolean;
  /** Icon before the label. Hidden from screen readers; replaced by the spinner while loading. */
  startIcon?: ReactNode;
  /** Icon after the label. Hidden from screen readers. */
  endIcon?: ReactNode;
  /** A square button with only an icon as its child. Give it an `aria-label`. */
  iconOnly?: boolean;
}

/**
 * Styles a native `<button>`, so it keeps focus, Enter, Space and form submit.
 *
 * ```tsx
 * <Button variant="danger" loading={saving}>Delete</Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  startIcon,
  endIcon,
  iconOnly = false,
  disabled,
  className,
  children,
  ...button
}: ButtonProps) {
  return (
    // The type comes from the caller, like a native button (submit inside a form).
    <button
      {...button}
      className={cx(
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        iconOnly && 'ui-button--icon',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className="ui-spinner" aria-hidden="true" />
      ) : (
        startIcon && (
          <span className="ui-button__icon" aria-hidden="true">
            {startIcon}
          </span>
        )
      )}
      {children}
      {endIcon && (
        <span className="ui-button__icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
}
