'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { Ref } from 'react';
import { cx } from './class-names.js';
import { setRef } from './checkbox.js';
import { Tag } from './content.js';

export interface ChipInputProps {
  label: string;
  hint?: string;
  placeholder?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  name?: string;
  error?: string;
  onBlur?: () => void;
  ref?: Ref<HTMLInputElement>;
  /** First word of each tag's × button. Translate it. */
  removeLabel?: string;
  /** What screen readers hear after a change. Translate them. */
  addedLabel?: (chip: string) => string;
  removedLabel?: (chip: string) => string;
  /** data-testid on the text field, for tests. */
  testId?: string;
  className?: string;
}

/**
 * A text field that collects several short values, such as toppings or email addresses.
 * Enter or a comma adds the text as a tag; Backspace in the empty field moves to the last
 * tag's × button. After a tag goes, focus moves to the next one, or back to the field.
 *
 * ```tsx
 * <ChipInput label="Toppings" value={toppings} onChange={setToppings} />
 * ```
 */
export function ChipInput({
  label,
  hint,
  placeholder,
  value,
  defaultValue = [],
  onChange,
  disabled,
  name,
  error,
  onBlur,
  ref,
  removeLabel = 'Remove',
  addedLabel = (c) => `${c} added`,
  removedLabel = (c) => `${c} removed`,
  testId,
  className,
}: ChipInputProps) {
  const id = useId();
  const [own, setOwn] = useState(defaultValue);
  const [said, setSaid] = useState('');
  const chips = value ?? own;
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  /** After a removal: the index whose × button gets focus once it has rendered. */
  const focusAt = useRef<number | null>(null);

  const buttons = () =>
    Array.from(
      box.current?.querySelectorAll<HTMLElement>('.ui-tag__remove') ?? [],
    );

  useEffect(() => {
    if (focusAt.current === null) return;
    const all = buttons();
    (all[Math.min(focusAt.current, all.length - 1)] ?? field.current)?.focus();
    focusAt.current = null;
  });

  const set = (next: string[]) => {
    setOwn(next);
    onChange?.(next);
  };

  return (
    <div className={cx('ui-field', error && 'ui-field--invalid', className)}>
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="ui-chips" ref={box}>
        {chips.length > 0 && (
          <ul className="ui-chips__list" aria-label={label}>
            {chips.map((chip, i) => (
              <li key={chip}>
                <Tag
                  removeLabel={removeLabel}
                  onRemove={
                    disabled
                      ? undefined
                      : () => {
                          set(chips.filter((_, j) => j !== i));
                          setSaid(removedLabel(chip));
                          focusAt.current = i;
                        }
                  }
                >
                  {chip}
                </Tag>
              </li>
            ))}
          </ul>
        )}
        <input
          ref={(el) => {
            field.current = el;
            setRef(ref, el);
          }}
          className="ui-chips__input"
          type="text"
          enterKeyHint="enter"
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            cx(hint && `${id}-hint`, error && `${id}-error`) || undefined
          }
          data-testid={testId}
          onBlur={onBlur}
          onKeyDown={(e) => {
            const input = e.currentTarget;
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              const chip = input.value.trim();
              input.value = '';
              if (!chip || chips.includes(chip)) return;
              set([...chips, chip]);
              setSaid(addedLabel(chip));
            } else if (e.key === 'Backspace' && !input.value) {
              buttons().pop()?.focus();
            }
          }}
        />
      </div>
      {name &&
        chips.map((chip) => (
          <input key={chip} type="hidden" name={name} value={chip} />
        ))}
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
      <span className="ui-visually-hidden" aria-live="polite">
        {said}
      </span>
    </div>
  );
}
