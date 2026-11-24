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
 * The multi-line twin of `ui-text-field`: label, textarea, hint and error as one
 * form control. Works with Reactive Forms and `ngModel`.
 *
 * ```html
 * <ui-textarea label="Delivery notes" [rows]="4" formControlName="notes" />
 * ```
 */
@Component({
  selector: 'ui-textarea',
  host: { class: 'ui-field' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <textarea
      class="ui-input"
      [id]="id"
      [rows]="rows()"
      [value]="value()"
      [disabled]="disabled()"
      [attr.maxlength]="maxlength() ?? null"
      [attr.aria-invalid]="error() ? true : null"
      [attr.aria-describedby]="describedBy()"
      [attr.data-testid]="testId()"
      (input)="update($event)"
      (blur)="markTouched()"
    ></textarea>
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
export class TextareaComponent
  implements ControlValueAccessor, FormValueControl<string>
{
  readonly label = input.required<string>();
  readonly rows = input(3);
  readonly maxlength = input<number>();
  readonly hint = input<string>();
  readonly error = input<string>();
  readonly testId = input<string>();

  protected readonly id = `ui-textarea-${nextId++}`;
  readonly value = model('');
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected update(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
