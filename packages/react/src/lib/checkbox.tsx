'use client';

import { useId, type ComponentPropsWithRef, type Ref } from 'react';
import { cx } from './class-names.js';

export interface CheckboxProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type'
> {
  /** The visible label; the whole label is the hit area. */
  label: string;
  hint?: string;
  /** The translated error. Marks the checkbox invalid and announces the message. */
  error?: string;
  /** Shows a dash for "some of these": a parent checkbox over a list. */
  indeterminate?: boolean;
  /** data-testid on the input, for tests. */
  testId?: string;
}

/** Sets a ref the caller passed, whatever its kind. */
export function setRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

/**
 * A native checkbox with its label, hint and error. Every other prop goes to the input,
 * so checked, onChange, name and ref work as on a native checkbox.
 *
 * ```tsx
 * <Checkbox label="Email me about my orders" checked={updates} onChange={(e) => setUpdates(e.target.checked)} />
 * ```
 */
export function Checkbox({
  label,
  hint,
  error,
  indeterminate = false,
  testId,
  id,
  className,
  ref,
  ...input
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy =
    cx(hint && `${inputId}-hint`, error && `${inputId}-error`) || undefined;

  return (
    <div className={cx('ui-field', error && 'ui-field--invalid', className)}>
      <label className="ui-check">
        <input
          {...input}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate;
            setRef(ref, el);
          }}
          type="checkbox"
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-testid={testId}
        />
        {label}
      </label>
      {hint && (
        <p className="ui-field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ui-field__error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
