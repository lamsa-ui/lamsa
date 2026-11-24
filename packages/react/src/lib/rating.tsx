'use client';

import type { Ref } from 'react';
import { useId, useState } from 'react';
import { cx } from './class-names.js';
import { Icon } from './icon.js';

const Star = () => <Icon name="star" />;

export interface RatingProps {
  /** Names the stars. Required when people pick. */
  label?: string;
  max?: number;
  /** Only shows `value`, read as one image. */
  readOnly?: boolean;
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number) => void;
  disabled?: boolean;
  /** The radios' name, for a plain form post. */
  name?: string;
  onBlur?: () => void;
  ref?: Ref<HTMLInputElement>;
  /** The name of one star: (n) => `${n} stars`. */
  starLabel?: (stars: number) => string;
  /** The read-only score in words: (value, max) => `${value} out of ${max} stars`. */
  scoreLabel?: (value: number, max: number) => string;
  className?: string;
}

/**
 * Stars out of five. To pick: native radios in a fieldset, so arrow keys move between the
 * stars. With `readOnly` it only shows a score: "4.5 out of 5 stars".
 *
 * ```tsx
 * <Rating label="How was the food?" value={food} onChange={setFood} />
 * <Rating value={4.5} readOnly />
 * ```
 */
export function Rating({
  label = '',
  max = 5,
  readOnly = false,
  value,
  defaultValue = null,
  onChange,
  disabled,
  name,
  onBlur,
  ref,
  starLabel = (n) => (n === 1 ? '1 star' : `${n} stars`),
  scoreLabel = (v, m) => `${v} out of ${m} stars`,
  className,
}: RatingProps) {
  const autoName = useId();
  const [own, setOwn] = useState(defaultValue);
  const current = value === undefined ? own : value;
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (readOnly) {
    const rounded = Math.round(current ?? 0);
    return (
      <span
        className={cx('ui-rating ui-rating--readonly', className)}
        role="img"
        aria-label={scoreLabel(current ?? 0, max)}
      >
        <span className="ui-rating__stars">
          {stars.map((n) => (
            <span
              key={n}
              className={cx(
                'ui-rating__star',
                n <= rounded && 'ui-rating__star--on',
              )}
            >
              <Star />
            </span>
          ))}
        </span>
      </span>
    );
  }

  return (
    <fieldset className={cx('ui-rating', className)} disabled={disabled}>
      <legend className="ui-field__label">{label}</legend>
      <span className="ui-rating__stars">
        {stars.map((n) => (
          <label key={n} className="ui-rating__star">
            <input
              ref={n === 1 ? ref : undefined}
              type="radio"
              className="ui-visually-hidden"
              name={name ?? autoName}
              value={n}
              checked={n === current}
              onChange={() => {
                setOwn(n);
                onChange?.(n);
              }}
              onBlur={onBlur}
            />
            <Star />
            <span className="ui-visually-hidden">{starLabel(n)}</span>
          </label>
        ))}
      </span>
    </fieldset>
  );
}
