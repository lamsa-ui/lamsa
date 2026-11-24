'use client';

import { useId, type ComponentPropsWithRef } from 'react';
import { cx } from './class-names.js';

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  /** The visible label, tied to the textarea. */
  label: string;
  /** Help text under the textarea, read with it. */
  hint?: string;
  /** The translated error. Marks the textarea invalid and announces the message. */
  error?: string;
  /** data-testid on the textarea, for tests. */
  testId?: string;
}

/**
 * The multi-line twin of TextField. Every other prop goes to the textarea, so
 * value, onChange, rows, maxLength, name and ref work as on a native textarea.
 *
 * ```tsx
 * <Textarea label="Delivery notes" rows={4} />
 * ```
 */
export function Textarea({
  label,
  hint,
  error,
  testId,
  id,
  className,
  rows = 3,
  ...textarea
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const describedBy =
    cx(hint && `${textareaId}-hint`, error && `${textareaId}-error`) ||
    undefined;

  return (
    <div className={cx('ui-field', className)}>
      <label className="ui-field__label" htmlFor={textareaId}>
        {label}
      </label>
      <textarea
        {...textarea}
        className="ui-input"
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        data-testid={testId}
      />
      {hint && (
        <p className="ui-field__hint" id={`${textareaId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ui-field__error" id={`${textareaId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
