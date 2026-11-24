import { useId, type ComponentPropsWithRef } from 'react';
import { cx } from './class-names.js';

export interface FieldsetProps extends ComponentPropsWithRef<'fieldset'> {
  /** The group's title; screen readers read it before each field in it. */
  legend: string;
  hint?: string;
}

/**
 * A titled group of fields inside a longer form, such as an address.
 *
 * ```tsx
 * <Fieldset legend="Delivery address">
 *   <TextField label="Street" />
 * </Fieldset>
 * ```
 */
export function Fieldset({
  legend,
  hint,
  className,
  children,
  ...fieldset
}: FieldsetProps) {
  const id = useId();
  return (
    <fieldset
      {...fieldset}
      className={cx('ui-fieldset', className)}
      aria-describedby={hint ? `${id}-hint` : undefined}
    >
      <legend className="ui-fieldset__legend">{legend}</legend>
      {hint && (
        <p className="ui-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {children}
    </fieldset>
  );
}
