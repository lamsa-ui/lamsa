import {
  effect,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  LOCALE_ID,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { IconComponent } from '../icon/icon.component';
import { latinDigits } from './digits';

let nextId = 0;

/** Reads what was typed, in Latin or Arabic digits, with or without group separators. */
// ponytail: reads "." (or Arabic "٫") as the decimal mark; locales that write "1.234,5" need a parser per locale.
export function parseNumber(text: string): number | null {
  const plain = latinDigits(text)
    .replace(/٫/g, '.')
    .replace(/[−–]/g, '-')
    .replace(/[^\d.-]/g, '');
  if (!/\d/.test(plain)) return null;
  const n = Number(plain);
  return Number.isFinite(n) ? n : null;
}

const decimals = (n: number) => (String(n).split('.')[1] ?? '').length;

/**
 * A number with − and + either side: a quantity, a price, a number of guests. Type it in
 * Latin or Arabic digits, or step it with the buttons, Up and Down, Page Up and Down (ten
 * steps), Home and End. On leaving the field it is kept between min and max and written in
 * the reader's language (`formatOptions` for currency, percent or units). The form control
 * gets a number, or null when empty.
 *
 * ```html
 * <ui-number-field label="Guests" [min]="1" [max]="12" formControlName="guests" />
 * ```
 */
@Component({
  selector: 'ui-number-field',
  imports: [IconComponent],
  host: {
    class: 'ui-field ui-number-field',
    '[class.ui-field--invalid]': '!!error()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFieldComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <div class="ui-input-group">
      <button
        type="button"
        class="ui-input-group__button"
        tabindex="-1"
        [attr.aria-label]="decrementLabel()"
        [attr.aria-controls]="id"
        [disabled]="disabled() || atMin()"
        (click)="stepBy(-1)"
      >
        <ui-icon name="minus" />
      </button>
      <input
        class="ui-input-group__input"
        type="text"
        role="spinbutton"
        autocomplete="off"
        [attr.inputmode]="(min() ?? -1) >= 0 ? 'decimal' : 'text'"
        [id]="id"
        [value]="text()"
        [disabled]="disabled()"
        [attr.aria-valuenow]="value()"
        [attr.aria-valuetext]="value() === null ? null : format(value())"
        [attr.aria-valuemin]="min() ?? null"
        [attr.aria-valuemax]="max() ?? null"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="describedBy()"
        [attr.data-testid]="testId()"
        (input)="typed($event)"
        (keydown)="key($event)"
        (blur)="commit()"
      />
      <button
        type="button"
        class="ui-input-group__button"
        tabindex="-1"
        [attr.aria-label]="incrementLabel()"
        [attr.aria-controls]="id"
        [disabled]="disabled() || atMax()"
        (click)="stepBy(1)"
      >
        <ui-icon name="plus" />
      </button>
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
export class NumberFieldComponent
  implements ControlValueAccessor, FormValueControl<number | null>
{
  readonly label = input.required<string>();
  readonly min = input<number>();
  readonly max = input<number>();
  /** How far one press moves. Page Up and Down move ten steps. */
  readonly step = input(1);
  readonly hint = input<string>();
  /** The translated error. Marks the field invalid and announces the message. */
  readonly error = input<string>();
  /** Digits and separators follow this (ar-EG writes Arabic digits). Defaults to the app's LOCALE_ID. */
  readonly locale = input(inject(LOCALE_ID));
  /**
   * Intl number format: `{ style: 'currency', currency: 'EGP' }`, `{ style: 'unit', unit: 'kilogram' }`.
   * With `{ style: 'percent' }` the value is the fraction (0.5 shows 50%), so use a step of 0.01.
   */
  readonly formatOptions = input<Intl.NumberFormatOptions>({});
  readonly decrementLabel = input('Decrease');
  readonly incrementLabel = input('Increase');
  readonly testId = input<string>();

  protected readonly id = `ui-number-field-${nextId++}`;
  readonly value = model<number | null>(null);
  protected readonly text = signal('');
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  private readonly formatter = computed(
    () =>
      new Intl.NumberFormat(this.locale(), {
        maximumFractionDigits: 20,
        ...this.formatOptions(),
      }),
  );
  protected readonly atMin = computed(() => {
    const v = this.value();
    const min = this.min();
    return v !== null && min !== undefined && v <= min;
  });
  protected readonly atMax = computed(() => {
    const v = this.value();
    const max = this.max();
    return v !== null && max !== undefined && v >= max;
  });
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );

  private onChange: (value: number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private lastValue: number | null = null;

  constructor() {
    effect(() => {
      const value = this.value();
      if (value !== this.lastValue) {
        this.lastValue = value;
        this.text.set(this.format(value));
      }
    });
  }

  protected format(value: number | null): string {
    if (value === null) return '';
    return this.formatter().format(value);
  }

  protected typed(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.text.set(text);
    const n = parseNumber(text);
    const value =
      n !== null && this.formatOptions().style === 'percent' ? n / 100 : n;
    this.lastValue = value;
    this.value.set(value);
    this.onChange(value);
  }

  protected commit(): void {
    this.markTouched();
    const v = this.value();
    this.set(v === null ? null : this.clamp(v));
  }

  protected stepBy(steps: number): void {
    const v = this.value();
    const step = this.step();
    const base = v ?? this.min() ?? 0;
    const next =
      v === null && steps > 0 && this.min() !== undefined
        ? base
        : Number((base + steps * step).toFixed(decimals(step)));
    this.set(this.clamp(next));
  }

  protected key(event: KeyboardEvent): void {
    const min = this.min();
    const max = this.max();
    const action = {
      ArrowUp: () => this.stepBy(1),
      ArrowDown: () => this.stepBy(-1),
      PageUp: () => this.stepBy(10),
      PageDown: () => this.stepBy(-10),
      Home: () => min !== undefined && this.set(min),
      End: () => max !== undefined && this.set(max),
      Enter: () => this.commit(),
    }[event.key];
    if (!action) return;
    if (event.key !== 'Enter') event.preventDefault();
    action();
  }

  private clamp(n: number): number {
    const min = this.min();
    const max = this.max();
    return min !== undefined && n < min
      ? min
      : max !== undefined && n > max
        ? max
        : n;
  }

  private set(value: number | null): void {
    const changed = value !== this.value();
    this.lastValue = value;
    this.value.set(value);
    this.text.set(this.format(value));
    if (changed) this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  writeValue(value: number | null): void {
    this.lastValue = value ?? null;
    this.value.set(value ?? null);
    this.text.set(this.format(value ?? null));
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
