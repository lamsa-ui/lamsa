'use client';

import type { Ref } from 'react';
import {
  Button,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  SearchField as AriaSearchField,
  Text,
} from 'react-aria-components';
import { cx } from './class-names.js';
import { Icon } from './icon.js';

/** Arabic-Indic (٠١٢) and Persian (۰۱۲) digits to Latin (012), so typed numbers read the same. */
export function latinDigits(text: string): string {
  return text
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/** Hint and error under a React Aria field, tied to it by its description and error slots. */
export const Hint = ({ hint, error }: { hint?: string; error?: string }) => (
  <>
    {hint && (
      <Text slot="description" className="ui-field__hint">
        {hint}
      </Text>
    )}
    {error && (
      <Text slot="errorMessage" className="ui-field__error" role="alert">
        {error}
      </Text>
    )}
  </>
);

export interface SearchFieldProps {
  label: string;
  /** Keeps the label for screen readers only, such as a search box in a header. */
  hideLabel?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Enter pressed: the text to search for. */
  onSearch?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  /** Names the × button; by default React Aria's translated "Clear search". Escape does the same. */
  clearLabel?: string;
  disabled?: boolean;
  name?: string;
  /** data-testid on the input, for tests. */
  testId?: string;
  className?: string;
  onBlur?: () => void;
  ref?: Ref<HTMLInputElement>;
}

/**
 * A field to search with, on React Aria: a search input with a magnifier and a clear button.
 * Escape clears it, Enter calls `onSearch`.
 *
 * ```tsx
 * <SearchField label="Search orders" hideLabel value={q} onChange={setQ} onSearch={find} />
 * ```
 */
export function SearchField({
  label,
  hideLabel,
  onSearch,
  placeholder,
  hint,
  clearLabel,
  disabled,
  onBlur,
  ref,
  testId,
  className,
  ...field
}: SearchFieldProps) {
  return (
    <AriaSearchField
      {...field}
      isDisabled={disabled}
      onSubmit={onSearch}
      onBlur={onBlur}
      className={cx('ui-field ui-search-field', className)}
    >
      {({ isEmpty }) => (
        <>
          <Label
            className={cx('ui-field__label', hideLabel && 'ui-visually-hidden')}
          >
            {label}
          </Label>
          <div className="ui-input-group">
            <span className="ui-input-group__addon" aria-hidden="true">
              <Icon name="search" />
            </span>
            <Input
              ref={ref}
              className="ui-input-group__input"
              placeholder={placeholder}
              enterKeyHint="search"
              data-testid={testId}
            />
            {!isEmpty && !disabled && (
              <Button
                className="ui-input-group__button"
                aria-label={clearLabel}
              >
                <Icon name="x" />
              </Button>
            )}
          </div>
          <Hint hint={hint} />
        </>
      )}
    </AriaSearchField>
  );
}

export interface NumberFieldProps {
  label: string;
  /** The number, or null while empty. */
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** How far one press moves. Page Up and Down move ten steps. */
  step?: number;
  /**
   * Intl number format: `{ style: 'currency', currency: 'EGP' }`, `{ style: 'unit', unit: 'kilogram' }`.
   * With `{ style: 'percent' }` the value is the fraction (0.5 shows 50%), so use a step of 0.01.
   */
  formatOptions?: Intl.NumberFormatOptions;
  hint?: string;
  /** The translated error. Marks the field invalid and announces the message. */
  error?: string;
  /** Name the − and + buttons; by default React Aria's translated "Decrease" and "Increase". */
  decrementLabel?: string;
  incrementLabel?: string;
  disabled?: boolean;
  name?: string;
  /** data-testid on the input, for tests. */
  testId?: string;
  className?: string;
  onBlur?: () => void;
  ref?: Ref<HTMLInputElement>;
}

const toAria = (n?: number | null) =>
  n === undefined ? undefined : n === null ? NaN : n;

/**
 * A number with − and + either side, on React Aria: a quantity, a price, a number of guests.
 * Type it in Latin or Arabic digits, or step it with the buttons and arrow keys. On leaving the
 * field it is kept between min and max and written in the reader's language (the nearest
 * I18nProvider, else the browser's).
 *
 * ```tsx
 * <NumberField label="Guests" min={1} max={12} value={guests} onChange={setGuests} />
 * ```
 */
export function NumberField({
  label,
  value,
  defaultValue,
  onChange,
  min,
  max,
  hint,
  error,
  decrementLabel,
  incrementLabel,
  disabled,
  onBlur,
  ref,
  testId,
  className,
  ...field
}: NumberFieldProps) {
  return (
    <AriaNumberField
      {...field}
      value={toAria(value)}
      defaultValue={toAria(defaultValue)}
      onChange={(n) => onChange?.(Number.isNaN(n) ? null : n)}
      minValue={min}
      maxValue={max}
      isDisabled={disabled}
      isInvalid={!!error}
      onBlur={onBlur}
      className={cx(
        'ui-field ui-number-field',
        error && 'ui-field--invalid',
        className,
      )}
    >
      <Label className="ui-field__label">{label}</Label>
      <Group className="ui-input-group">
        <Button
          slot="decrement"
          className="ui-input-group__button"
          aria-label={decrementLabel}
        >
          <Icon name="minus" />
        </Button>
        <Input
          ref={ref}
          className="ui-input-group__input"
          data-testid={testId}
        />
        <Button
          slot="increment"
          className="ui-input-group__button"
          aria-label={incrementLabel}
        >
          <Icon name="plus" />
        </Button>
      </Group>
      <Hint hint={hint} error={error} />
    </AriaNumberField>
  );
}
