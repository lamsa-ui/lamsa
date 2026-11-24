import {
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';

let nextId = 0;

/**
 * Label, input, hint and error as one form control. Works with Reactive Forms
 * (`formControlName`, `[formControl]`) and template forms (`ngModel`).
 *
 * Pass the already translated error text in `error`; when it is set the input is
 * marked `aria-invalid` and the message is announced.
 */
@Component({
  selector: 'ui-text-field',
  host: { class: 'ui-field' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <!-- Without a prefix or suffix the wrapper is not drawn: the input sits in the field. -->
    <div
      [class.ui-input-group]="affixed()"
      [style.display]="affixed() ? null : 'contents'"
    >
      @if (prefix()) {
        <span class="ui-input-group__addon" [id]="id + '-prefix'">{{
          prefix()
        }}</span>
      }
      <input
        [class]="affixed() ? 'ui-input-group__input' : 'ui-input'"
        [id]="id"
        [type]="type()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.autocomplete]="autocomplete()"
        [attr.min]="min() ?? null"
        [attr.max]="max() ?? null"
        [attr.step]="step() ?? null"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="describedBy()"
        [attr.data-testid]="testId()"
        (input)="update($event)"
        (blur)="markTouched()"
      />
      @if (suffix()) {
        <span
          class="ui-input-group__addon ui-input-group__addon--end"
          [id]="id + '-suffix'"
          >{{ suffix() }}</span
        >
      }
    </div>
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
export class TextFieldComponent
  implements ControlValueAccessor, FormValueControl<string | number | null>
{
  readonly label = input.required<string>();
  /**
   * `date`, `time` and `datetime-local` use the browser's own picker, in the reader's
   * language and calendar. `number` writes a number (or `null`) to the form control.
   */
  readonly type = input<
    | 'text'
    | 'email'
    | 'password'
    | 'search'
    | 'tel'
    | 'url'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime-local'
  >('text');
  /** Lowest and highest value for number, date and time fields (`'2026-01-31'` for a date). */
  readonly min = input<string | number>();
  readonly max = input<string | number>();
  readonly step = input<string | number>();
  readonly hint = input<string>();
  readonly error = input<string>();
  readonly autocomplete = input<string>();
  readonly testId = input<string>();

  protected readonly id = `ui-text-field-${nextId++}`;
  readonly value = model<string | number | null>('');
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  /** Text before the value, such as a currency: "EGP". Read after the label. */
  readonly prefix = input<string>();
  /** Text after the value, such as a unit or a domain: "kg", ".com". */
  readonly suffix = input<string>();
  protected readonly affixed = computed(
    () => !!(this.prefix() || this.suffix()),
  );
  protected readonly describedBy = computed(
    () =>
      [
        this.prefix() && `${this.id}-prefix`,
        this.suffix() && `${this.id}-suffix`,
        this.hint() && `${this.id}-hint`,
        this.error() && `${this.id}-error`,
      ]
        .filter(Boolean)
        .join(' ') || null,
  );

  private onChange: (value: string | number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected update(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const value =
      this.type() !== 'number' ? raw : raw === '' ? null : Number(raw);
    this.value.set(value);
    this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  writeValue(value: string | number | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
