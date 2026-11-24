import type { ComponentPropsWithRef } from 'react';
import { cx } from './class-names.js';

export type BadgeVariant =
  'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  variant?: BadgeVariant;
}

/**
 * A short status label. The text carries the meaning; the colour only repeats it,
 * so write the status in words ("Paid", "Late"), never colour alone.
 *
 * ```tsx
 * <Badge variant="success">Paid</Badge>
 * ```
 */
export function Badge({ variant = 'neutral', className, ...span }: BadgeProps) {
  return (
    <span
      {...span}
      className={cx('ui-badge', `ui-badge--${variant}`, className)}
    />
  );
}
