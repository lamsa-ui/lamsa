'use client';

import { useId, type ComponentPropsWithRef } from 'react';
import { cx } from './class-names.js';

export interface SwitchProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'role'
> {
  label: string;
  hint?: string;
  /** data-testid on the input, for tests. */
  testId?: string;
}

/**
 * An on/off setting that takes effect at once, such as notifications. A native checkbox
 * with `role="switch"`, so screen readers say "on" and "off". Every other prop goes to the
 * input. For a choice that is saved with a form, use Checkbox.
 *
 * ```tsx
 * <Switch label="Dark mode" checked={dark} onChange={(e) => setDark(e.target.checked)} />
 * ```
 */
export function Switch({
  label,
  hint,
  testId,
  id,
  className,
  ...input
}: SwitchProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={cx('ui-field', className)}>
      <label className="ui-switch">
        {label}
        <input
          {...input}
          type="checkbox"
          role="switch"
          className="ui-switch__input"
          id={inputId}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          data-testid={testId}
        />
      </label>
      {hint && (
        <p className="ui-field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}
