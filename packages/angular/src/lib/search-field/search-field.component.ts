import {
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { IconComponent } from '../icon/icon.component';

let nextId = 0;

/**
 * A field to search with: a search input with a magnifier and a clear button. Escape
 * clears it, Enter emits `submitted`. Works with Reactive Forms and `ngModel`; the value is
 * the text. The label can be hidden when the page already makes the purpose clear, but it
 * is still read by screen readers.
 *
 * ```html
 * <ui-search-field label="Search orders" hideLabel formControlName="q" (submitted)="find($event)" />
 * ```
 */
@Component({
  selector: 'ui-search-field',
  imports: [IconComponent],
  host: { class: 'ui-field ui-search-field' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchFieldComponent),
      multi: true,
    },
  ],
  template: `
    <label
      class="ui-field__label"
      [class.ui-visually-hidden]="hideLabel()"
      [for]="id"
      >{{ label() }}</label
    >
    <div class="ui-input-group">
      <span class="ui-input-group__addon" aria-hidden="true">
        <ui-icon name="search" />
      </span>
      <input
        #field
        class="ui-input-group__input"
        type="search"
        enterkeyhint="search"
        [id]="id"
        [value]="value()"
        [placeholder]="placeholder() ?? ''"
        [disabled]="disabled()"
        [attr.aria-describedby]="hint() ? id + '-hint' : null"
        [attr.data-testid]="testId()"
        (input)="update($event)"
        (keydown.escape)="clear($event)"
        (keydown.enter)="submitted.emit(value())"
        (blur)="markTouched()"
      />
      @if (value() && !disabled()) {
        <button
          type="button"
          class="ui-input-group__button"
          tabindex="-1"
          [attr.aria-label]="clearLabel()"
          (click)="clear()"
        >
          <ui-icon name="x" />
        </button>
      }
    </div>
    @if (hint()) {
      <p class="ui-field__hint" [id]="id + '-hint'">{{ hint() }}</p>
    }
  `,
})
export class SearchFieldComponent
  implements ControlValueAccessor, FormValueControl<string>
{
  readonly label = input.required<string>();
  /** Keeps the label for screen readers only, such as a search box in a header. */
  readonly hideLabel = input(false, { transform: booleanAttribute });
  readonly placeholder = input<string>();
  readonly hint = input<string>();
  /** Names the × button. Escape does the same. */
  readonly clearLabel = input('Clear search');
  readonly testId = input<string>();
  /** Enter pressed: the text to search for. */
  readonly submitted = output<string>();

  protected readonly id = `ui-search-field-${nextId++}`;
  readonly value = model('');
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  private readonly field =
    viewChild.required<ElementRef<HTMLInputElement>>('field');

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected update(event: Event): void {
    this.set((event.target as HTMLInputElement).value);
  }

  protected clear(event?: Event): void {
    if (!this.value()) return;
    event?.preventDefault();
    this.set('');
    this.field().nativeElement.value = '';
    this.field().nativeElement.focus();
  }

  private set(value: string): void {
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
