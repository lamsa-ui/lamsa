'use client';

import type { IconName } from '@lamsa-ui/icons';
import type { Ref } from 'react';
import { useId, useState } from 'react';
import { cx } from './class-names.js';
import { Icon } from './icon.js';

/** One segment: its value, its words, and an icon to show beside them (or instead, with iconOnly). */
export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> {
  /** Names the group for screen readers: "View". */
  label: string;
  options: readonly SegmentOption<T>[];
  value?: T | null;
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Shows only the icons; the words stay for screen readers. */
  iconOnly?: boolean;
  /** Fills the width, segments sharing it equally. */
  block?: boolean;
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
 * One choice from two to five short options side by side, such as a view (List, Grid) or a
 * period (Day, Week, Month). Native radios: Tab reaches the group, arrow keys move the choice.
 * The chosen segment sits on a raised tile with an edge, so colour is never the only sign.
 *
 * ```tsx
 * <SegmentedControl label="View" options={views} value={view} onChange={setView} />
 * ```
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  defaultValue,
  onChange,
  iconOnly,
  block,
  disabled,
  name,
  onBlur,
  ref,
  testId,
  className,
}: SegmentedControlProps<T>) {
  const id = useId();
  const [own, setOwn] = useState<T | null>(defaultValue ?? null);
  const current = value === undefined ? own : value;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('ui-segmented', block && 'ui-segmented--block', className)}
    >
      {options.map((option, index) => (
        <label className="ui-segmented__option" key={option.value}>
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
          {option.icon && <Icon name={option.icon} />}
          <span className={cx(iconOnly && option.icon && 'ui-visually-hidden')}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
