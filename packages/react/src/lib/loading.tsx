import { useId } from 'react';
import { cx } from './class-names.js';

export interface SpinnerProps {
  /** What is loading, in words; read by screen readers. Pass the translated text. */
  label?: string;
  /** Shows the label next to the spinner too. */
  showLabel?: boolean;
  /** `lg`: a bigger spinner over its label, for a whole page or panel. */
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Shows that something is loading, and says so to screen readers. For a busy button,
 * use `loading` on the button instead.
 *
 * ```tsx
 * <Spinner label="Loading orders" />
 * ```
 */
export function Spinner({
  label = 'Loading',
  showLabel = false,
  size = 'md',
  className,
}: SpinnerProps) {
  return (
    <span
      role="status"
      className={cx('ui-loading', size === 'lg' && 'ui-loading--lg', className)}
    >
      <span className="ui-spinner" aria-hidden="true" />
      <span className={showLabel ? undefined : 'ui-visually-hidden'}>
        {label}
      </span>
    </span>
  );
}

export interface ProgressProps {
  label: string;
  /** How much is done, from 0 to `max`. Leave it out when the end is not known. */
  value?: number | null;
  max?: number;
  /** The amount in words, such as "3 of 5 files". Defaults to a percentage. */
  valueText?: string;
  testId?: string;
  className?: string;
}

/**
 * A progress bar named by its label, on the native `<progress>`, with the amount in
 * words beside it.
 *
 * ```tsx
 * <Progress label="Uploading invoice.pdf" value={sent} />
 * ```
 */
export function Progress({
  label,
  value,
  max = 100,
  valueText,
  testId,
  className,
}: ProgressProps) {
  const id = useId();
  const text =
    valueText ??
    (value == null
      ? ''
      : new Intl.NumberFormat(undefined, { style: 'percent' }).format(
          Math.min(Math.max(value / max, 0), 1),
        ));
  return (
    <div className={cx('ui-progress', className)}>
      <div className="ui-progress__head">
        <span className="ui-progress__label" id={id}>
          {label}
        </span>
        {text && (
          <span className="ui-progress__value" aria-hidden="true">
            {text}
          </span>
        )}
      </div>
      <progress
        className="ui-progress__bar"
        aria-labelledby={id}
        value={value ?? undefined}
        max={max}
        aria-valuetext={valueText}
        data-testid={testId}
      />
    </div>
  );
}

export interface SkeletonProps {
  /** `text`: lines of text; `circle`: an avatar; `block`: an image or card. */
  shape?: 'text' | 'circle' | 'block';
  /** Lines of text; the last one is shorter. */
  lines?: number;
  className?: string;
}

/**
 * Grey shapes in place of content that is loading. Hidden from screen readers: mark the
 * area `aria-busy` and put a Spinner or a status message with it.
 */
export function Skeleton({
  shape = 'text',
  lines = 1,
  className,
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cx('ui-skeleton', `ui-skeleton--${shape}`, className)}
    >
      {Array.from({ length: shape === 'text' ? lines : 1 }, (_, i) => (
        <span key={i} className="ui-skeleton__shape" />
      ))}
    </div>
  );
}
