import {
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormCheckboxControl } from '@angular/forms/signals';

let nextId = 0;

/**
 * A native checkbox with its label, hint and error. The whole label is the hit area.
 * Works with Reactive Forms and `ngModel`; the value is `true` or `false`.
 *
 * ```html
 * <ui-checkbox label="Email me about my orders" formControlName="updates" />
 * ```
 */
@Component({
  selector: 'ui-checkbox',
  host: {
    class: 'ui-field',
    '[class.ui-field--invalid]': '!!error()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-check">
      <input
        type="checkbox"
        [id]="id"
        [checked]="checked()"
        [indeterminate]="indeterminate()"
        [disabled]="disabled()"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="describedBy()"
        [attr.data-testid]="testId()"
        (change)="update($event)"
        (blur)="markTouched()"
      />
      {{ label() }}
    </label>
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
    @if (error()) {
      <p class="ui-field__error" [id]="id + '-error'" role="alert">
        {{ error() }}
      </p>
    }
  `,
})
export class CheckboxComponent
  implements ControlValueAccessor, FormCheckboxControl
{
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string>();
  /** Shows a dash for "some of these": a parent checkbox over a list. */
  readonly indeterminate = input(false);
  readonly testId = input<string>();

  protected readonly id = `ui-checkbox-${nextId++}`;
  readonly checked = model(false);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected update(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked.set(checked);
    this.onChange(checked);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
