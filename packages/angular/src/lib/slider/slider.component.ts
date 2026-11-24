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
 * A value picked along a range, such as a price limit. A native range input: arrow keys,
 * Page Up/Down, Home and End move it. The value is written beside the label; `format`
 * turns it into words for the screen and for screen readers ("EGP 500", not "500").
 *
 * ```html
 * <ui-slider label="Price limit" [min]="0" [max]="2000" [step]="50" formControlName="price" />
 * ```
 */
@Component({
  selector: 'ui-slider',
  host: { class: 'ui-field' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ui-slider__head">
      <label class="ui-field__label" [for]="id">{{ label() }}</label>
      <output class="ui-slider__value" [for]="id" aria-hidden="true">{{
        text()
      }}</output>
    </div>
    <input
      type="range"
      class="ui-slider"
      [id]="id"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [value]="value()"
      [disabled]="disabled()"
      [style.--ui-slider-fill]="fill()"
      [attr.aria-valuetext]="format() ? text() : null"
      [attr.aria-describedby]="hint() ? id + '-hint' : null"
      [attr.data-testid]="testId()"
      (input)="update($event)"
      (blur)="markTouched()"
    />
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
  `,
})
export class SliderComponent
  implements ControlValueAccessor, FormValueControl<number>
{
  readonly label = input.required<string>();
  readonly min = input<number | undefined>(0);
  readonly max = input<number | undefined>(100);
  readonly step = input(1);
  readonly hint = input<string>();
  /** Turns the number into what people read and hear: (v) => `EGP ${v}`. */
  readonly format = input<(value: number) => string>();
  readonly testId = input<string>();

  protected readonly id = `ui-slider-${nextId++}`;
  readonly value = model(0);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly text = computed(
    () => this.format()?.(this.value()) ?? String(this.value()),
  );
  protected readonly fill = computed(() => {
    const min = this.min() ?? 0;
    const span = (this.max() ?? 100) - min || 1;
    return `${((this.value() - min) / span) * 100}%`;
  });

  private onChange: (value: number) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected update(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.value.set(value);
    this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? this.min() ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
