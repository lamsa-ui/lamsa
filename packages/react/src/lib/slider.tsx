'use client';

import {
  useId,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
} from 'react';
import { cx } from './class-names.js';

export interface SliderProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'value' | 'defaultValue'
> {
  label: string;
  hint?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  /** Turns the number into what people read and hear: (v) => `EGP ${v}`. */
  format?: (value: number) => string;
  /** data-testid on the input, for tests. */
  testId?: string;
}

/**
 * A value picked along a range, such as a price limit. A native range input: arrow keys,
 * Page Up/Down, Home and End move it. Every other prop goes to the input.
 *
 * ```tsx
 * <Slider label="Price limit" max={2000} step={50} value={price} onChange={(e) => setPrice(+e.target.value)} />
 * ```
 */
export function Slider({
  label,
  hint,
  value,
  defaultValue,
  min = 0,
  max = 100,
  format,
  testId,
  id,
  className,
  onChange,
  ...input
}: SliderProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [own, setOwn] = useState(defaultValue ?? min);
  const current = value ?? own;
  const text = format?.(current) ?? String(current);
  const fill = `${((current - min) / (max - min || 1)) * 100}%`;

  return (
    <div className={cx('ui-field', className)}>
      <div className="ui-slider__head">
        <label className="ui-field__label" htmlFor={inputId}>
          {label}
        </label>
        <output className="ui-slider__value" htmlFor={inputId} aria-hidden>
          {text}
        </output>
      </div>
      <input
        {...input}
        type="range"
        className="ui-slider"
        id={inputId}
        min={min}
        max={max}
        value={current}
        style={{ '--ui-slider-fill': fill } as CSSProperties}
        aria-valuetext={format ? text : undefined}
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        data-testid={testId}
        onChange={(event) => {
          setOwn(Number(event.target.value));
          onChange?.(event);
        }}
      />
      {hint && (
        <p className="ui-field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}
