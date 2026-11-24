import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  model,
  output,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { latinDigits } from '../number-field/digits';

let nextId = 0;

/**
 * A one-time code, one box per digit, such as the code sent by SMS. Typing moves to the next
 * box, Backspace goes back, arrow keys move. A pasted code, or one the phone offers from the
 * message (`autocomplete="one-time-code"`), fills every box. Arabic digits are read as Latin.
 * The form control gets the digits as one string; `complete` fires once every box is filled.
 *
 * ```html
 * <ui-pin-input label="Verification code" [length]="6" formControlName="code" (complete)="verify($event)" />
 * ```
 */
@Component({
  selector: 'ui-pin-input',
  host: {
    class: 'ui-field ui-pin-input',
    '[class.ui-field--invalid]': '!!error()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PinInputComponent),
      multi: true,
    },
  ],
  template: `
    <span class="ui-field__label" [id]="id + '-label'">{{ label() }}</span>
    <div
      class="ui-pin"
      role="group"
      [attr.aria-labelledby]="id + '-label'"
      [attr.aria-describedby]="describedBy()"
    >
      @for (digit of digits(); track $index) {
        <input
          #cell
          class="ui-input ui-pin__cell"
          placeholder=" "
          inputmode="numeric"
          [type]="secret() ? 'password' : 'text'"
          [attr.autocomplete]="$index === 0 ? 'one-time-code' : 'off'"
          [attr.aria-label]="cellLabel()($index + 1, length())"
          [attr.aria-invalid]="error() ? true : null"
          [attr.data-testid]="testId() ? testId() + '-' + $index : null"
          [value]="digit"
          [disabled]="disabled()"
          (focus)="cellAt($index).select()"
          (input)="typed($index)"
          (keydown)="key($event, $index)"
          (blur)="markTouched()"
        />
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
export class PinInputComponent
  implements ControlValueAccessor, FormValueControl<string>
{
  readonly label = input.required<string>();
  /** How many digits. */
  readonly length = input(6);
  /** Shows dots instead of digits, for a PIN rather than a code sent by message. */
  readonly secret = input(false, { transform: booleanAttribute });
  /** Each box's name for screen readers. Translate it. */
  readonly cellLabel = input<(n: number, of: number) => string>(
    (n, of) => `Digit ${n} of ${of}`,
  );
  readonly hint = input<string>();
  /** The translated error. Marks the boxes invalid and announces the message. */
  readonly error = input<string>();
  /** data-testid prefix; each box gets -<index>. */
  readonly testId = input<string>();
  /** Every box is filled: the whole code. */
  readonly complete = output<string>();

  protected readonly id = `ui-pin-input-${nextId++}`;
  /** One entry per box; '' while empty. */
  readonly value = model('');
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly digits = computed(() =>
    Array.from({ length: this.length() }, (_, i) => this.value()[i] ?? ''),
  );
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );
  private readonly cells = viewChildren<ElementRef<HTMLInputElement>>('cell');

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected cellAt(index: number): HTMLInputElement {
    return this.cells()[index].nativeElement;
  }

  /** One digit typed, or a whole code pasted or autofilled into one box. */
  protected typed(index: number): void {
    const typed = latinDigits(this.cellAt(index).value).replace(/\D/g, '');
    const next = [...this.digits()];
    if (!typed) next[index] = '';
    [...typed].slice(0, next.length - index).forEach((d, i) => {
      next[index + i] = d;
    });
    this.set(next);
    if (typed)
      this.cellAt(Math.min(index + typed.length, next.length - 1)).focus();
  }

  protected key(event: KeyboardEvent, index: number): void {
    const last = this.length() - 1;
    const go = (i: number) => {
      event.preventDefault();
      this.cellAt(Math.max(0, Math.min(last, i))).focus();
    };
    if (event.key === 'ArrowLeft') go(index - 1);
    else if (event.key === 'ArrowRight') go(index + 1);
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(last);
    else if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      const next = [...this.digits()];
      next[index - 1] = '';
      this.set(next);
      go(index - 1);
    }
  }

  private set(chars: string[]): void {
    const code = chars.join('');
    this.value.set(code);
    // A rejected letter leaves the signal as it was, so put the boxes back by hand.
    this.cells().forEach((c, i) => (c.nativeElement.value = chars[i] ?? ''));
    this.onChange(code);
    if (chars.every(Boolean)) this.complete.emit(code);
  }

  writeValue(value: string | null): void {
    this.value.set(latinDigits(value ?? '').replace(/\D/g, ''));
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

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }
}
