'use client';

import type { Ref } from 'react';
import {
  ComboBox as AriaComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
  useFilter,
  type Key,
} from 'react-aria-components';
import { cx } from './class-names.js';
import type { SelectOption } from './select.js';

export interface ComboboxProps<T extends Key> {
  /** The visible label; it names the field and the list. */
  label: string;
  options: readonly SelectOption<T>[];
  /** The chosen value, when you control it. */
  value?: T | null;
  defaultValue?: T | null;
  /** Called with the picked value, or `null` when the field is emptied. */
  onChange?: (value: T | null) => void;
  placeholder?: string;
  hint?: string;
  /** The translated error. Marks the field invalid and announces the message. */
  error?: string;
  /** Shown when nothing matches; pass the translated text. */
  emptyText?: string;
  disabled?: boolean;
  /** Form field name, so the value is sent with a native form. */
  name?: string;
  onBlur?: () => void;
  /** Ref to the text input, for form-library focus management. */
  ref?: Ref<HTMLInputElement>;
  /** data-testid on the input; options get -option-<index>. */
  testId?: string;
  className?: string;
}

/**
 * A text field that filters a list as you type, on React Aria. Focus stays in the field:
 * arrow keys move through the matches, Enter picks one, Escape closes the list.
 *
 * ```tsx
 * <Combobox label="Country" options={countries} value={country} onChange={setCountry} />
 * ```
 */
export function Combobox<T extends Key>({
  label,
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  hint,
  error,
  emptyText = 'No matches',
  disabled,
  name,
  onBlur,
  ref,
  testId,
  className,
}: ComboboxProps<T>) {
  const { contains } = useFilter({ sensitivity: 'base' });

  return (
    <AriaComboBox
      className={({ isInvalid }) =>
        cx('ui-field', isInvalid && 'ui-field--invalid', className)
      }
      selectedKey={value}
      defaultSelectedKey={defaultValue}
      onSelectionChange={(key) => onChange?.(key as T | null)}
      defaultFilter={contains}
      allowsEmptyCollection
      isInvalid={!!error}
      isDisabled={disabled}
      name={name}
      onBlur={onBlur}
      disabledKeys={options.filter((o) => o.disabled).map((o) => o.value)}
    >
      <Label className="ui-field__label">{label}</Label>
      <Input
        ref={ref}
        className="ui-input"
        placeholder={placeholder}
        data-testid={testId}
      />
      {hint && (
        <Text slot="description" elementType="p" className="ui-field__hint">
          {hint}
        </Text>
      )}
      {error && (
        <Text
          slot="errorMessage"
          elementType="p"
          className="ui-field__error"
          role="alert"
        >
          {error}
        </Text>
      )}
      <Popover
        offset={4}
        style={{
          inlineSize: 'var(--trigger-width)',
          zIndex: 'var(--ui-layer-popover)',
        }}
      >
        <ListBox
          className="ui-listbox"
          renderEmptyState={() => (
            <p className="ui-listbox__empty" role="status">
              {emptyText}
            </p>
          )}
        >
          {options.map((option, index) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
              className={({ isFocused }) =>
                cx('ui-option', isFocused && 'ui-option--active')
              }
              data-testid={testId ? `${testId}-option-${index}` : undefined}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
