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
import type { SelectOption } from '../select/select.component';

export type RadioOption<T> = SelectOption<T>;

let nextId = 0;

/**
 * One choice from a short list, all options in view. Native radios, so arrow keys
 * move between them and Tab leaves the group. For a long list, use `ui-select`.
 *
 * ```html
 * <ui-radio-group label="Delivery" [options]="speeds" formControlName="speed" />
 * ```
 */
@Component({
  selector: 'ui-radio-group',
  host: {
    class: 'ui-field',
    role: 'radiogroup',
    '[class.ui-field--invalid]': '!!error()',
    '[attr.aria-labelledby]': "id + '-label'",
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.aria-invalid]': 'error() ? true : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <span class="ui-field__label" [id]="id + '-label'">{{ label() }}</span>
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
    <div
      class="ui-choices"
      [class.ui-choices--inline]="orientation() === 'horizontal'"
    >
      @for (option of options(); track option.value) {
        <label class="ui-check">
          <input
            type="radio"
            [name]="id"
            [checked]="isChecked(option.value)"
            [disabled]="disabled() || !!option.disabled"
            [attr.data-testid]="testId() ? testId() + '-' + $index : null"
            (change)="pick(option.value)"
            (blur)="markTouched()"
          />
          {{ option.label }}
        </label>
      }
    </div>
    @if (error()) {
      <p class="ui-field__error" [id]="id + '-error'" role="alert">
        {{ error() }}
      </p>
    }
  `,
})
export class RadioGroupComponent<T>
  implements ControlValueAccessor, FormValueControl<T | null>
{
  readonly label = input.required<string>();
  readonly options = input.required<readonly RadioOption<T>[]>();
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly hint = input<string>();
  readonly error = input<string>();
  /** data-testid prefix; each radio gets -<index>. */
  readonly testId = input<string>();
  readonly compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);

  protected readonly id = `ui-radio-group-${nextId++}`;
  readonly value = model<T | null>(null);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );

  private onChange: (value: T) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected isChecked(value: T): boolean {
    const current = this.value();
    return current !== null && this.compareWith()(value, current);
  }

  protected pick(value: T): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  writeValue(value: T | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
