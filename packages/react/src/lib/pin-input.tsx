'use client';

import { useId, useRef, useState, type Ref } from 'react';
import { cx } from './class-names.js';
import { latinDigits } from './fields.js';

export interface PinInputProps {
  label: string;
  /** How many digits. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  /** Every box is filled: the whole code. */
  onComplete?: (code: string) => void;
  /** Shows dots instead of digits, for a PIN rather than a code sent by message. */
  secret?: boolean;
  /** Each box's name for screen readers. Translate it. */
  cellLabel?: (n: number, of: number) => string;
  hint?: string;
  /** The translated error. Marks the boxes invalid and announces the message. */
  error?: string;
  disabled?: boolean;
  /** Form field name: the code is submitted as one value. */
  name?: string;
  onBlur?: () => void;
  /** Ref to the first digit, for form-library focus management. */
  ref?: Ref<HTMLInputElement>;
  /** data-testid prefix; each box gets -<index>. */
  testId?: string;
  className?: string;
}

const cells = (code: string, length: number) =>
  Array.from({ length }, (_, i) => code[i] ?? '');

/**
 * A one-time code, one box per digit, such as the code sent by SMS. Typing moves to the next
 * box, Backspace goes back, arrow keys move. A pasted code, or one the phone offers from the
 * message, fills every box. Arabic digits are read as Latin.
 *
 * ```tsx
 * <PinInput label="Verification code" length={6} onComplete={verify} />
 * ```
 */
export function PinInput({
  label,
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  secret,
  cellLabel = (n, of) => `Digit ${n} of ${of}`,
  hint,
  error,
  disabled,
  name,
  onBlur,
  ref,
  testId,
  className,
}: PinInputProps) {
  const id = useId();
  const [own, setOwn] = useState(() => cells(defaultValue, length));
  const digits = value === undefined ? own : cells(value, length);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) =>
    refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  const describedBy = cx(hint && `${id}-hint`, error && `${id}-error`);

  const set = (next: string[]) => {
    setOwn(next);
    const code = next.join('');
    onChange?.(code);
    if (next.every(Boolean)) onComplete?.(code);
  };

  return (
    <div
      className={cx(
        'ui-field ui-pin-input',
        error && 'ui-field--invalid',
        className,
      )}
    >
      <span className="ui-field__label" id={`${id}-label`}>
        {label}
      </span>
      <div
        className="ui-pin"
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy || undefined}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
              if (index === 0) {
                if (typeof ref === 'function') ref(el);
                else if (ref) ref.current = el;
              }
            }}
            className="ui-input ui-pin__cell"
            type={secret ? 'password' : 'text'}
            inputMode="numeric"
            placeholder=" "
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={cellLabel(index + 1, length)}
            aria-invalid={error ? true : undefined}
            data-testid={testId ? `${testId}-${index}` : undefined}
            value={digit}
            disabled={disabled}
            onBlur={onBlur}
            onFocus={(e) => e.currentTarget.select()}
            onChange={(e) => {
              const typed = latinDigits(e.target.value).replace(/\D/g, '');
              const next = [...digits];
              if (!typed) next[index] = '';
              [...typed].slice(0, length - index).forEach((d, i) => {
                next[index + i] = d;
              });
              set(next);
              if (typed) focus(index + typed.length);
            }}
            onKeyDown={(e) => {
              const go = (i: number) => {
                e.preventDefault();
                focus(i);
              };
              if (e.key === 'ArrowLeft') go(index - 1);
              else if (e.key === 'ArrowRight') go(index + 1);
              else if (e.key === 'Home') go(0);
              else if (e.key === 'End') go(length - 1);
              else if (e.key === 'Backspace' && !digit && index > 0) {
                const next = [...digits];
                next[index - 1] = '';
                set(next);
                go(index - 1);
              }
            }}
          />
        ))}
      </div>
      {name && <input type="hidden" name={name} value={digits.join('')} />}
      {hint && (
        <p className="ui-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ui-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
