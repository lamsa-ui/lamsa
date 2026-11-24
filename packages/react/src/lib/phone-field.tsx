'use client';

import { useId, useState, type Ref } from 'react';
import {
  Button as AriaButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
} from 'react-aria-components';
import { cx } from './class-names.js';
import { latinDigits } from './fields.js';
import { Icon } from './icon.js';

/** A country in the code list: ISO alpha-2 code, international dialling code, and its name as shown. */
export interface PhoneCountry {
  code: string;
  dial: string;
  name: string;
}

function flagEmoji(code: string): string | undefined {
  const iso = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(iso)) return undefined;
  return String.fromCodePoint(
    ...Array.from(iso, (letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
}

/** The Arab world first, then the most common elsewhere. Pass your own list to translate or trim it. */
export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  { code: 'EG', dial: '+20', name: 'Egypt' },
  { code: 'SA', dial: '+966', name: 'Saudi Arabia' },
  { code: 'AE', dial: '+971', name: 'UAE' },
  { code: 'KW', dial: '+965', name: 'Kuwait' },
  { code: 'QA', dial: '+974', name: 'Qatar' },
  { code: 'BH', dial: '+973', name: 'Bahrain' },
  { code: 'OM', dial: '+968', name: 'Oman' },
  { code: 'JO', dial: '+962', name: 'Jordan' },
  { code: 'LB', dial: '+961', name: 'Lebanon' },
  { code: 'IQ', dial: '+964', name: 'Iraq' },
  { code: 'PS', dial: '+970', name: 'Palestine' },
  { code: 'SY', dial: '+963', name: 'Syria' },
  { code: 'YE', dial: '+967', name: 'Yemen' },
  { code: 'LY', dial: '+218', name: 'Libya' },
  { code: 'SD', dial: '+249', name: 'Sudan' },
  { code: 'TN', dial: '+216', name: 'Tunisia' },
  { code: 'DZ', dial: '+213', name: 'Algeria' },
  { code: 'MA', dial: '+212', name: 'Morocco' },
  { code: 'TR', dial: '+90', name: 'Türkiye' },
  { code: 'GB', dial: '+44', name: 'UK' },
  { code: 'DE', dial: '+49', name: 'Germany' },
  { code: 'FR', dial: '+33', name: 'France' },
  { code: 'US', dial: '+1', name: 'USA' },
];

/** Splits +201001234567 into its country and national number, keeping `prefer` when it fits. */
function split(
  value: string | null | undefined,
  countries: readonly PhoneCountry[],
  prefer?: string,
): { country?: string; number: string } {
  if (!value) return { number: '' };
  const plain = '+' + latinDigits(value).replace(/\D/g, '');
  const current = countries.find((c) => c.code === prefer);
  const match =
    current && plain.startsWith(current.dial)
      ? current
      : [...countries]
          .sort((a, b) => b.dial.length - a.dial.length)
          .find((c) => plain.startsWith(c.dial));
  return match
    ? { country: match.code, number: plain.slice(match.dial.length) }
    : { number: plain };
}

/** The international number for a dialling code and a typed national number, or null. */
const full = (dial: string, text: string) => {
  const digits = latinDigits(text).replace(/\D/g, '').replace(/^0+/, '');
  return digits ? dial + digits : null;
};

export interface PhoneFieldProps {
  label: string;
  /** One international number, `+201001234567`, or null when empty. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  /** The country picked at first, by ISO code. A value picks its own. */
  country?: string;
  countries?: readonly PhoneCountry[];
  /** Names the country list for screen readers. */
  countryLabel?: string;
  placeholder?: string;
  hint?: string;
  /** The translated error. Marks the field invalid and announces the message. */
  error?: string;
  disabled?: boolean;
  /** Form field name: the whole international number is submitted. */
  name?: string;
  onBlur?: () => void;
  /** Ref to the number input, for form-library focus management. */
  ref?: Ref<HTMLInputElement>;
  /** data-testid on the number; the picker trigger gets -country. */
  testId?: string;
  className?: string;
}

/**
 * A phone number: the country code in a list, the number beside it. Reads left to right in
 * every language, takes Arabic digits, and drops the leading 0 people type out of habit, so
 * the value is one international number (E.164).
 *
 * ```tsx
 * <PhoneField label="Mobile" country="EG" value={phone} onChange={setPhone} />
 * ```
 */
export function PhoneField({
  label,
  value,
  defaultValue,
  onChange,
  country = 'EG',
  countries = PHONE_COUNTRIES,
  countryLabel = 'Country code',
  placeholder,
  hint,
  error,
  disabled,
  name,
  onBlur,
  ref,
  testId,
  className,
}: PhoneFieldProps) {
  const id = useId();
  const first = split(value ?? defaultValue, countries, country);
  const [code, setCode] = useState(first.country ?? country);
  const [number, setNumber] = useState(first.number);
  const picked = countries.find((c) => c.code === code) ?? countries[0];
  const own = full(picked?.dial ?? '', number);
  const pickedFlag = picked && flagEmoji(picked.code);

  // A new value from outside (not the one this field just sent) is split again.
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    if (value !== undefined && value !== own) {
      const next = split(value, countries, code);
      if (next.country) setCode(next.country);
      setNumber(next.number);
    }
  }

  const emit = (dial: string, text: string) => onChange?.(full(dial, text));
  const describedBy = cx(hint && `${id}-hint`, error && `${id}-error`);

  return (
    <div
      className={cx(
        'ui-field ui-phone-field',
        error && 'ui-field--invalid',
        className,
      )}
    >
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="ui-input-group">
        <AriaSelect
          className="ui-phone-field__select"
          aria-label={`${countryLabel}: ${picked?.name ?? ''} ${picked?.dial ?? ''}`}
          selectedKey={picked?.code}
          isDisabled={disabled}
          onSelectionChange={(key) => {
            if (typeof key !== 'string') return;
            const country = countries.find((c) => c.code === key);
            if (!country) return;
            setCode(country.code);
            emit(country.dial, number);
          }}
        >
          <AriaButton
            className="ui-phone-field__country"
            data-testid={testId ? `${testId}-country` : undefined}
          >
            {pickedFlag ? (
              <span className="ui-phone-field__flag" aria-hidden="true">
                {pickedFlag}
              </span>
            ) : (
              <Icon
                name="flag"
                className="ui-phone-field__flag-icon"
                aria-hidden="true"
              />
            )}
            <SelectValue className="ui-phone-field__name" />
            <Icon name="chevron-down" className="ui-select__chevron" />
          </AriaButton>
          <Popover
            className="ui-phone-field__popover"
            placement="bottom start"
            offset={4}
            style={{
              inlineSize: 'max-content',
              zIndex: 'var(--ui-layer-popover)',
            }}
          >
            <ListBox className="ui-listbox ui-phone-field__listbox">
              {countries.map((c, index) => {
                const flag = flagEmoji(c.code);
                return (
                  <ListBoxItem
                    key={c.code}
                    id={c.code}
                    textValue={`${c.name} ${c.dial}`}
                    className={({ isFocused }) =>
                      cx('ui-option', isFocused && 'ui-option--active')
                    }
                    data-testid={
                      testId ? `${testId}-country-option-${index}` : undefined
                    }
                  >
                    {flag ? (
                      <span className="ui-phone-field__flag" aria-hidden="true">
                        {flag}
                      </span>
                    ) : (
                      <Icon
                        name="flag"
                        className="ui-phone-field__flag-icon"
                        aria-hidden="true"
                      />
                    )}
                    {c.name} {c.dial}
                  </ListBoxItem>
                );
              })}
            </ListBox>
          </Popover>
        </AriaSelect>
        <input
          ref={ref}
          className="ui-input-group__input"
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={number}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          data-testid={testId}
          onChange={(e) => {
            setNumber(e.target.value);
            emit(picked?.dial ?? '', e.target.value);
          }}
          onBlur={onBlur}
        />
      </div>
      {name && <input type="hidden" name={name} value={own ?? ''} />}
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
