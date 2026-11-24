import { CdkListbox, CdkOption } from '@angular/cdk/listbox';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
  model,
  output,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { IconComponent } from '../icon/icon.component';
import { latinDigits } from '../number-field/digits';

let nextId = 0;

/** A country in the code list: ISO alpha-2 code, international dialling code, and its name as shown. */
export interface PhoneCountry {
  code: string;
  dial: string;
  name: string;
}

/** The Arab world first, then the most common elsewhere. Pass your own list to translate or trim it. */
export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  { code: 'EG', dial: '+20', name: 'Egypt' },
  { code: 'SA', dial: '+966', name: 'Saudi Arabia' },
  { code: 'AE', dial: '+971', name: 'UAE' },
  { code: 'KW', dial: '+965', name: 'Kuwait' },
  { code: 'QA', dial: '+974', name: 'Qatar' },
  { code: 'BH', dial: '+973', name: 'Bahrain' },
  { code: 'OM', dial: '+968', name: 'Oman' },
  { code: 'JO', dial: '+962', name: 'Jordan' },
  { code: 'LB', dial: '+961', name: 'Lebanon' },
  { code: 'IQ', dial: '+964', name: 'Iraq' },
  { code: 'PS', dial: '+970', name: 'Palestine' },
  { code: 'SY', dial: '+963', name: 'Syria' },
  { code: 'YE', dial: '+967', name: 'Yemen' },
  { code: 'LY', dial: '+218', name: 'Libya' },
  { code: 'SD', dial: '+249', name: 'Sudan' },
  { code: 'TN', dial: '+216', name: 'Tunisia' },
  { code: 'DZ', dial: '+213', name: 'Algeria' },
  { code: 'MA', dial: '+212', name: 'Morocco' },
  { code: 'TR', dial: '+90', name: 'Türkiye' },
  { code: 'GB', dial: '+44', name: 'UK' },
  { code: 'DE', dial: '+49', name: 'Germany' },
  { code: 'FR', dial: '+33', name: 'France' },
  { code: 'US', dial: '+1', name: 'USA' },
];

/** The digits of a typed national number: Arabic digits read, spaces and the leading trunk 0 dropped. */
export const nationalDigits = (text: string) =>
  latinDigits(text).replace(/\D/g, '').replace(/^0+/, '');

/**
 * A phone number: the country code in a list, the number beside it. Reads left to right in
 * every language, takes Arabic digits, and drops the leading 0 people type out of habit, so
 * the form control gets one international number: `+201001234567` (E.164), or null when empty.
 *
 * ```html
 * <ui-phone-field label="Mobile" country="EG" formControlName="phone" />
 * ```
 */
@Component({
  selector: 'ui-phone-field',
  imports: [
    IconComponent,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    CdkListbox,
    CdkOption,
  ],
  host: {
    class: 'ui-field ui-phone-field',
    '[class.ui-field--invalid]': '!!error()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneFieldComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <div class="ui-input-group">
      <button
        #countryTrigger
        type="button"
        class="ui-phone-field__country"
        cdkOverlayOrigin
        #countryOrigin="cdkOverlayOrigin"
        [id]="id + '-country'"
        [disabled]="disabled()"
        [attr.aria-label]="
          countryLabel() + ': ' + picked().name + ' ' + picked().dial
        "
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        [attr.data-testid]="testId() ? testId() + '-country' : null"
        (click)="open() ? close() : show()"
        (keydown.arrowdown)="show($event)"
        (keydown.arrowup)="show($event)"
      >
        @if (flagEmoji(picked().code); as flag) {
          <span class="ui-phone-field__flag" aria-hidden="true">{{
            flag
          }}</span>
        } @else {
          <ui-icon
            name="flag"
            class="ui-phone-field__flag-icon"
            aria-hidden="true"
          />
        }
        <span class="ui-phone-field__name"
          >{{ picked().name }} {{ picked().dial }}</span
        >
        <ui-icon name="chevron-down" class="ui-select__chevron" />
      </button>
      <input
        class="ui-input-group__input"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        [id]="id"
        [value]="number()"
        [placeholder]="placeholder() ?? ''"
        [disabled]="disabled()"
        [attr.aria-invalid]="error() ? true : null"
        [attr.aria-describedby]="describedBy()"
        [attr.data-testid]="testId()"
        (input)="typed($event)"
        (blur)="markTouched()"
      />
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="countryOrigin"
        [cdkConnectedOverlayOpen]="open()"
        cdkConnectedOverlayUsePopover="inline"
        (overlayOutsideClick)="outsideClick($event)"
        (overlayKeydown)="keydown($event)"
        (detach)="open.set(false)"
      >
        <ul
          class="ui-listbox ui-phone-field__listbox"
          cdkListbox
          [cdkListboxValue]="countryValue()"
          [attr.aria-label]="countryLabel()"
          (cdkListboxValueChange)="pickCountry($event.value)"
        >
          @for (c of countries(); track c.code) {
            <li
              #opt="cdkOption"
              class="ui-option"
              [class.ui-option--active]="opt.isActive()"
              [cdkOption]="c.code"
              [attr.data-testid]="
                testId() ? testId() + '-country-option-' + $index : null
              "
            >
              @if (flagEmoji(c.code); as flag) {
                <span class="ui-phone-field__flag" aria-hidden="true">{{
                  flag
                }}</span>
              } @else {
                <ui-icon
                  name="flag"
                  class="ui-phone-field__flag-icon"
                  aria-hidden="true"
                />
              }
              {{ c.name }} {{ c.dial }}
            </li>
          }
        </ul>
      </ng-template>
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
export class PhoneFieldComponent
  implements ControlValueAccessor, FormValueControl<string | null>
{
  readonly label = input.required<string>();
  /** The country picked at first, by ISO code. A value from the form picks its own. */
  readonly country = input('EG');
  readonly countries = input<readonly PhoneCountry[]>(PHONE_COUNTRIES);
  /** Names the country list for screen readers. */
  readonly countryLabel = input('Country code');
  readonly placeholder = input<string>();
  readonly hint = input<string>();
  /** The translated error. Marks the field invalid and announces the message. */
  readonly error = input<string>();
  /** data-testid on the number; the picker trigger gets -country. */
  readonly testId = input<string>();

  protected readonly id = `ui-phone-field-${nextId++}`;
  protected readonly number = signal('');
  readonly value = model<string | null>(null);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly open = signal(false);
  private readonly chosen = signal<string | null>(null);
  protected readonly picked = computed(() => {
    const code = this.chosen() ?? this.country();
    const list = this.countries();
    return list.find((c) => c.code === code) ?? list[0];
  });
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );
  protected readonly countryValue = computed(() => [this.picked().code]);
  protected flagEmoji(code: string): string | null {
    const iso = code.toUpperCase();
    if (!/^[A-Z]{2}$/.test(iso)) return null;
    return String.fromCodePoint(
      ...Array.from(iso, (letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
    );
  }
  private readonly injector = inject(Injector);
  private readonly countryTrigger =
    viewChild.required<ElementRef<HTMLButtonElement>>('countryTrigger');
  private readonly listbox = viewChild(CdkListbox);

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private lastValue: string | null = null;

  constructor() {
    effect(() => {
      const value = this.value();
      if (value !== this.lastValue) {
        this.lastValue = value;
        this.displayValue(value);
      }
    });
  }

  protected show(event?: Event): void {
    event?.preventDefault();
    this.open.set(true);
    afterNextRender(() => this.listbox()?.focus(), { injector: this.injector });
  }

  protected close(returnFocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.markTouched();
    if (returnFocus) this.countryTrigger().nativeElement.focus();
  }

  protected pickCountry(values: readonly string[]): void {
    if (values.length) {
      this.chosen.set(values[0]);
      this.emit();
    }
    this.close();
  }

  protected keydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      this.close();
    }
  }

  protected outsideClick(event: MouseEvent): void {
    if (!this.countryTrigger().nativeElement.contains(event.target as Node))
      this.close(false);
  }

  protected typed(event: Event): void {
    this.number.set((event.target as HTMLInputElement).value);
    this.emit();
  }

  private emit(): void {
    const digits = nationalDigits(this.number());
    const dial = this.picked().dial;
    const value = digits ? dial + digits : null;
    this.lastValue = value;
    this.value.set(value);
    this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  writeValue(value: string | null): void {
    this.lastValue = value;
    this.value.set(value);
    this.displayValue(value);
  }

  private displayValue(value: string | null): void {
    if (!value) {
      this.number.set('');
      return;
    }
    const plain = '+' + latinDigits(value).replace(/\D/g, '');
    const current = this.picked();
    // Keep the picked country when it fits (the US and Canada share +1), else the longest code that does.
    const match =
      current && plain.startsWith(current.dial)
        ? current
        : [...this.countries()]
            .sort((a, b) => b.dial.length - a.dial.length)
            .find((c) => plain.startsWith(c.dial));
    if (match) this.chosen.set(match.code);
    this.number.set(match ? plain.slice(match.dial.length) : plain);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
    if (disabled) this.close(false);
  }
}
