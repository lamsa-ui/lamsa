import { Component, forwardRef, input, model, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormCheckboxControl } from '@angular/forms/signals';

let nextId = 0;

/**
 * An on/off setting that takes effect at once, such as notifications. A native
 * checkbox with `role="switch"`, so screen readers say "on" and "off".
 * For a choice that is saved with a form, use `ui-checkbox`.
 *
 * ```html
 * <ui-switch label="Dark mode" formControlName="dark" />
 * ```
 */
@Component({
  selector: 'ui-switch',
  host: { class: 'ui-field' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-switch">
      {{ label() }}
      <input
        type="checkbox"
        role="switch"
        class="ui-switch__input"
        [id]="id"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.aria-describedby]="hint() ? id + '-hint' : null"
        [attr.data-testid]="testId()"
        (change)="update($event)"
        (blur)="markTouched()"
      />
    </label>
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
  `,
})
export class SwitchComponent
  implements ControlValueAccessor, FormCheckboxControl
{
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly testId = input<string>();

  protected readonly id = `ui-switch-${nextId++}`;
  readonly checked = model(false);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();

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
