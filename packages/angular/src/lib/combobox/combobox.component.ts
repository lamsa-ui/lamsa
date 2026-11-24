import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import type { SelectOption } from '../select/select.component';
import { UI_LABELS } from '../labels';

let nextId = 0;

/**
 * A text field that filters a list as you type, for a long list such as countries.
 * Focus stays in the field: arrow keys move through the matches, Enter picks one,
 * Escape closes the list. The value is always one of the options.
 *
 * ```html
 * <ui-combobox label="Country" [options]="countries" formControlName="country" />
 * ```
 */
@Component({
  selector: 'ui-combobox',
  host: {
    class: 'ui-field',
    '[class.ui-field--invalid]': '!!error()',
  },
  imports: [CdkConnectedOverlay, CdkOverlayOrigin],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [id]="id + '-label'" [for]="id">
      {{ label() }}
    </label>
    <input
      #field
      class="ui-input"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [id]="id"
      [value]="query()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="open() ? id + '-list' : null"
      [attr.aria-activedescendant]="activeId()"
      [attr.aria-invalid]="error() ? true : null"
      [attr.aria-describedby]="describedBy()"
      [attr.data-testid]="testId()"
      (input)="type($event)"
      (click)="open.set(true)"
      (keydown)="keydown($event)"
      (blur)="blur()"
    />
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayMatchWidth]="true"
      cdkConnectedOverlayUsePopover="inline"
      (overlayOutsideClick)="outsideClick($event)"
      (detach)="open.set(false)"
    >
      @if (matches().length) {
        <ul
          class="ui-listbox"
          role="listbox"
          [id]="id + '-list'"
          [attr.aria-labelledby]="id + '-label'"
        >
          @for (option of matches(); track option.value) {
            <!-- Keyboard use goes through the field (aria-activedescendant); the click is for the pointer. -->
            <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
            <li
              role="option"
              class="ui-option"
              [id]="id + '-option-' + $index"
              [class.ui-option--active]="$index === active()"
              [attr.aria-selected]="isSelected(option)"
              [attr.aria-disabled]="option.disabled || null"
              [attr.data-testid]="
                testId() ? testId() + '-option-' + $index : null
              "
              (mousedown)="$event.preventDefault()"
              (click)="pick(option)"
            >
              {{ option.label }}
            </li>
          }
        </ul>
      } @else {
        <p class="ui-listbox__empty" role="status">{{ emptyTextText() }}</p>
      }
    </ng-template>
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
export class ComboboxComponent<T>
  implements ControlValueAccessor, FormValueControl<T | null>
{
  private readonly uiLabels = inject(UI_LABELS);
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption<T>[]>();
  readonly placeholder = input('');
  readonly hint = input<string>();
  readonly error = input<string>();
  /** Shown when nothing matches; pass the translated text. */
  readonly emptyText = input<string>();
  protected readonly emptyTextText = computed(
    () => this.emptyText() ?? this.uiLabels().noMatches,
  );
  readonly testId = input<string>();
  readonly compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);

  protected readonly id = `ui-combobox-${nextId++}`;
  protected readonly open = signal(false);
  protected readonly active = signal(-1);
  readonly value = model<T | null>(null);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  private readonly field =
    viewChild.required<ElementRef<HTMLInputElement>>('field');

  protected readonly selected = computed(() => {
    const value = this.value();
    return value === null
      ? undefined
      : this.options().find((o) => this.compareWith()(o.value, value));
  });
  /** The text in the field: the chosen option's label, until the reader types. */
  protected readonly query = linkedSignal(() => this.selected()?.label ?? '');
  /** Every option while the field shows the chosen one; otherwise those that contain the text. */
  protected readonly matches = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    if (!query || query === this.selected()?.label.toLocaleLowerCase())
      return this.options();
    return this.options().filter((o) =>
      o.label.toLocaleLowerCase().includes(query),
    );
  });
  protected readonly activeId = computed(() =>
    this.open() && this.active() >= 0
      ? `${this.id}-option-${this.active()}`
      : null,
  );
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );

  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    // Keep the active option in view while the arrow keys move through a long list.
    afterRenderEffect(() => {
      const id = this.activeId();
      if (id)
        document.getElementById(id)?.scrollIntoView?.({ block: 'nearest' });
    });
  }

  protected isSelected(option: SelectOption<T>): boolean {
    return option === this.selected();
  }

  protected type(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(-1);
    this.open.set(true);
  }

  protected keydown(event: KeyboardEvent): void {
    const matches = this.matches();
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.open()) this.open.set(true);
        this.active.set(this.step(event.key === 'ArrowDown' ? 1 : -1));
        break;
      }
      case 'Enter':
        if (this.open() && matches[this.active()]) {
          event.preventDefault();
          this.pick(matches[this.active()]);
        }
        break;
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.open.set(false);
        }
        break;
    }
  }

  /** The next enabled match from the active one, wrapping round. */
  private step(direction: 1 | -1): number {
    const matches = this.matches();
    for (let i = 1; i <= matches.length; i++) {
      const next =
        (this.active() + direction * i + matches.length * 2) % matches.length;
      if (!matches[next].disabled) return next;
    }
    return -1;
  }

  protected pick(option: SelectOption<T>): void {
    if (option.disabled) return;
    this.value.set(option.value);
    this.query.set(option.label);
    this.onChange(option.value);
    this.open.set(false);
  }

  /** Leaving the field keeps the value an option: an emptied field clears it, other text goes back. */
  protected blur(): void {
    this.open.set(false);
    if (!this.query().trim() && this.value() !== null) {
      this.value.set(null);
      this.onChange(null);
    }
    this.query.set(this.selected()?.label ?? '');
    this.markTouched();
  }

  private markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  protected outsideClick(event: MouseEvent): void {
    if (event.target !== this.field().nativeElement) this.open.set(false);
  }

  writeValue(value: T | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
