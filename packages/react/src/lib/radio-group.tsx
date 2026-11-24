'use client';

import type { Ref } from 'react';
import { useId, useState } from 'react';
import { cx } from './class-names.js';

export interface RadioOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string> {
  /** The visible label; it names the group. */
  label: string;
  options: readonly RadioOption<T>[];
  /** The chosen value, when you control it. */
  value?: T | null;
  defaultValue?: T;
  onChange?: (value: T) => void;
  orientation?: 'vertical' | 'horizontal';
  hint?: string;
  /** The translated error. Marks the group invalid and announces the message. */
  error?: string;
  disabled?: boolean;
  /** Form field name; one is made up when left out. */
  name?: string;
  onBlur?: () => void;
  /** Ref to the first radio, for form-library focus management. */
  ref?: Ref<HTMLInputElement>;
  /** data-testid prefix; each radio gets -<index>. */
  testId?: string;
  className?: string;
}

/**
 * One choice from a short list, all options in view. Native radios, so arrow keys move
 * between them and Tab leaves the group. For a long list, use Select.
 *
 * ```tsx
 * <RadioGroup label="Delivery" options={speeds} value={speed} onChange={setSpeed} />
 * ```
 */
export function RadioGroup<T extends string>({
  label,
  options,
  value,
  defaultValue,
  onChange,
  orientation = 'vertical',
  hint,
  error,
  disabled,
  name,
  onBlur,
  ref,
  testId,
  className,
}: RadioGroupProps<T>) {
  const id = useId();
  const [own, setOwn] = useState<T | null>(defaultValue ?? null);
  const current = value === undefined ? own : value;
  const describedBy = cx(hint && `${id}-hint`, error && `${id}-error`);

  return (
    <div
      role="radiogroup"
      className={cx('ui-field', error && 'ui-field--invalid', className)}
      aria-labelledby={`${id}-label`}
      aria-describedby={describedBy || undefined}
      aria-invalid={error ? true : undefined}
    >
      <span className="ui-field__label" id={`${id}-label`}>
        {label}
      </span>
      {hint && (
        <p className="ui-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      <div
        className={cx(
          'ui-choices',
          orientation === 'horizontal' && 'ui-choices--inline',
        )}
      >
        {options.map((option, index) => (
          <label className="ui-check" key={option.value}>
            <input
              ref={index === 0 ? ref : undefined}
              type="radio"
              name={name ?? id}
              value={option.value}
              checked={current === option.value}
              disabled={disabled || option.disabled}
              data-testid={testId ? `${testId}-${index}` : undefined}
              onChange={() => {
                setOwn(option.value);
                onChange?.(option.value);
              }}
              onBlur={onBlur}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p className="ui-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
