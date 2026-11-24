'use client';

import {
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type DragEvent,
} from 'react';
import { setRef } from './checkbox.js';
import { cx } from './class-names.js';

export interface FileFieldProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type'
> {
  label: string;
  hint?: string;
  /** The translated error. Marks the field invalid and announces the message. */
  error?: string;
  /** The line under the button; pass the translated text. */
  dropText?: string;
  /** Called with the chosen files, picked or dropped. */
  onFiles?: (files: File[]) => void;
  /** data-testid on the input, for tests. */
  testId?: string;
}

/**
 * The native file input with a label, hint and error, in a zone that also takes files
 * dropped on it. A drop fills the input itself, so a form sends the files. Every other
 * prop goes to the input: accept, multiple, name, onChange, ref.
 *
 * `accept` limits the picker, not a drop, so check the type and size again on the server.
 *
 * ```tsx
 * <FileField label="Invoice" accept=".pdf" onFiles={setFiles} />
 * ```
 */
export function FileField({
  label,
  hint,
  error,
  dropText = 'Or drop a file here',
  onFiles,
  testId,
  id,
  className,
  disabled,
  multiple,
  onChange,
  ref,
  ...input
}: FileFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const field = useRef<HTMLInputElement | null>(null);
  const [over, setOver] = useState(false);
  const describedBy =
    cx(hint && `${inputId}-hint`, error && `${inputId}-error`) || undefined;

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setOver(false);
    const files = event.dataTransfer.files;
    if (disabled || !files.length || !field.current) return;
    if (multiple || files.length === 1) field.current.files = files;
    else {
      const one = new DataTransfer();
      one.items.add(files[0]);
      field.current.files = one.files;
    }
    onFiles?.(Array.from(field.current.files ?? []));
  }

  return (
    <div className={cx('ui-field', error && 'ui-field--invalid', className)}>
      <label className="ui-field__label" htmlFor={inputId}>
        {label}
      </label>
      <div
        className={cx('ui-dropzone', over && 'ui-dropzone--over')}
        onDragOver={(event) => {
          if (disabled) return;
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={drop}
      >
        <input
          {...input}
          ref={(el) => {
            field.current = el;
            setRef(ref, el);
          }}
          type="file"
          className="ui-file"
          id={inputId}
          disabled={disabled}
          multiple={multiple}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-testid={testId}
          onChange={(event) => {
            onChange?.(event);
            onFiles?.(Array.from(event.target.files ?? []));
          }}
        />
        {!disabled && <p className="ui-dropzone__text">{dropText}</p>}
      </div>
      {hint && (
        <p className="ui-field__hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ui-field__error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
