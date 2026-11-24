import type { OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  LOCALE_ID,
  model,
  output,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import {
  CalendarComponent,
  type DateRange,
} from '../calendar/calendar.component';
import { IconComponent } from '../icon/icon.component';
import { anchoredOverlay } from '../popover/anchored';

let nextId = 0;

/**
 * A date to type or to pick. The field is the browser's own date input, so typing follows
 * the reader's language and order; the button beside it opens the kit's calendar, which can
 * also close off dates (`isDisabled`). Alt + Down opens it from the field. Escape or a click
 * outside closes it; picking a date closes it and returns focus to the button. The form
 * control gets an ISO date (YYYY-MM-DD), or null.
 * In range mode, two date fields and the calendar share a DateRange value.
 *
 * ```html
 * <ui-date-picker label="Delivery day" min="2026-11-20" [isDisabled]="isFriday" formControlName="day" />
 * ```
 */
@Component({
  selector: 'ui-date-picker',
  imports: [CalendarComponent, IconComponent],
  host: {
    class: 'ui-field ui-date-picker',
    '[class.ui-field--invalid]': '!!error()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  template: `
    <label class="ui-field__label" [for]="id">{{ label() }}</label>
    <div class="ui-input-group" #group>
      @if (selection() === 'single') {
        <input
          class="ui-input-group__input"
          type="date"
          [id]="id"
          [value]="value() ?? ''"
          [attr.min]="min()"
          [attr.max]="max()"
          [disabled]="disabled()"
          [attr.aria-invalid]="error() ? true : null"
          [attr.aria-describedby]="describedBy()"
          [attr.data-testid]="testId()"
          (input)="typed($event)"
          (keydown)="fieldKey($event)"
          (blur)="markTouched()"
        />
      } @else {
        <input
          class="ui-input-group__input"
          type="date"
          [id]="id"
          [value]="range()?.start ?? ''"
          [attr.min]="min()"
          [attr.max]="max()"
          [disabled]="disabled()"
          [attr.aria-label]="label() + ': ' + rangeStartLabel()"
          [attr.aria-invalid]="error() ? true : null"
          [attr.aria-describedby]="describedBy()"
          [attr.data-testid]="testId() ? testId() + '-start' : null"
          (input)="typedRangeStart($event)"
          (keydown)="fieldKey($event)"
          (blur)="markTouched()"
        />
        <span class="ui-date-picker__separator" aria-hidden="true">–</span>
        <input
          class="ui-input-group__input"
          type="date"
          [id]="id + '-end'"
          [value]="range()?.end ?? ''"
          [attr.min]="min()"
          [attr.max]="max()"
          [disabled]="disabled() || !range()?.start"
          [attr.aria-label]="label() + ': ' + rangeEndLabel()"
          [attr.aria-invalid]="error() ? true : null"
          [attr.aria-describedby]="describedBy()"
          [attr.data-testid]="testId() ? testId() + '-end' : null"
          (input)="typedRangeEnd($event)"
          (keydown)="fieldKey($event)"
          (blur)="markTouched()"
        />
      }
      <button
        #trigger
        type="button"
        class="ui-input-group__button"
        aria-haspopup="dialog"
        [attr.aria-label]="calendarLabel()"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="open() ? id + '-panel' : null"
        [disabled]="disabled()"
        (click)="open() ? close() : show()"
      >
        <ui-icon name="calendar" />
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
    <ng-template #panel>
      <div
        class="ui-popover ui-date-picker__popover"
        role="dialog"
        [id]="id + '-panel'"
        [attr.aria-label]="calendarLabel()"
      >
        <ui-calendar
          [label]="label()"
          [selection]="selection()"
          [value]="value()"
          [range]="range()"
          [min]="min() ?? null"
          [max]="max() ?? null"
          [isDisabled]="isDisabled()"
          [locale]="locale()"
          [previousLabel]="previousLabel()"
          [nextLabel]="nextLabel()"
          (valueChange)="picked($event)"
          (rangeChange)="pickedRange($event)"
        />
      </div>
    </ng-template>
  `,
})
export class DatePickerComponent
  implements ControlValueAccessor, FormValueControl<string | null>
{
  readonly label = input.required<string>();
  /** Pick one date, or a start and end date. */
  readonly selection = input<'single' | 'range'>('single');
  /** Translated accessible names for the two fields in range mode. */
  readonly rangeStartLabel = input('Start date');
  readonly rangeEndLabel = input('End date');
  /** Earliest and latest dates, as YYYY-MM-DD. Both the field and the calendar keep to them. */
  readonly min = input<string | undefined>(undefined);
  readonly max = input<string | undefined>(undefined);
  /** Dates the calendar won't pick, such as closed days. Check them again in the form's validator, as typing can still reach them. */
  readonly isDisabled = input<(date: string) => boolean>(() => false);
  readonly hint = input<string>();
  /** The translated error. Marks the field invalid and announces the message. */
  readonly error = input<string>();
  /** The calendar's month and day names follow this. Defaults to the app's LOCALE_ID. */
  readonly locale = input(inject(LOCALE_ID));
  /** Names the calendar button and the panel it opens. */
  readonly calendarLabel = input('Choose date');
  readonly previousLabel = input('Previous month');
  readonly nextLabel = input('Next month');
  readonly testId = input<string>();

  protected readonly id = `ui-date-picker-${nextId++}`;
  readonly value = model<string | null>(null);
  /** The picked range when selection is range; end is null until the second date is picked. */
  readonly range = model<DateRange | null>(null);
  readonly disabled = model(false);
  readonly touched = input(false);
  readonly touch = output<void>();
  protected readonly open = signal(false);
  protected readonly describedBy = computed(
    () =>
      [this.hint() && `${this.id}-hint`, this.error() && `${this.id}-error`]
        .filter(Boolean)
        .join(' ') || null,
  );
  private readonly group = viewChild.required<ElementRef<HTMLElement>>('group');
  private readonly trigger =
    viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild.required<TemplateRef<unknown>>('panel');
  private readonly injector = inject(Injector);
  private readonly viewContainer = inject(ViewContainerRef);
  private overlay?: OverlayRef;

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.overlay?.dispose());
  }

  show(): void {
    this.overlay ??= this.create();
    if (!this.overlay.hasAttached())
      this.overlay.attach(new TemplatePortal(this.panel(), this.viewContainer));
    this.open.set(true);
    const pane = this.overlay.overlayElement;
    afterNextRender(
      () =>
        pane
          .querySelector<HTMLElement>('.ui-calendar__day[tabindex="0"]')
          ?.focus(),
      { injector: this.injector },
    );
  }

  close(returnFocus = true): void {
    if (!this.open()) return;
    this.overlay?.detach();
    this.open.set(false);
    if (returnFocus) this.trigger().nativeElement.focus();
  }

  protected typed(event: Event): void {
    const value = (event.target as HTMLInputElement).value || null;
    this.value.set(value);
    this.onChange(value);
  }

  protected typedRangeStart(event: Event): void {
    const start = (event.target as HTMLInputElement).value || null;
    this.setRange(start, start ? (this.range()?.end ?? null) : null);
  }

  protected typedRangeEnd(event: Event): void {
    const end = (event.target as HTMLInputElement).value || null;
    const start = this.range()?.start;
    if (start) this.setRange(start, end);
  }

  protected fieldKey(event: KeyboardEvent): void {
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      this.show();
    }
  }

  protected picked(date: string | null): void {
    this.value.set(date);
    this.onChange(date);
    this.markTouched();
    this.close();
  }

  protected pickedRange(range: DateRange | null): void {
    this.range.set(range);
    if (range?.end) {
      this.markTouched();
      this.close();
    }
  }

  private setRange(start: string | null, end: string | null): void {
    if (!start) {
      this.range.set(null);
    } else {
      this.range.set(
        end && end < start ? { start: end, end: start } : { start, end },
      );
    }
  }

  protected markTouched(): void {
    this.onTouched();
    this.touch.emit();
  }

  private create(): OverlayRef {
    const overlay = anchoredOverlay(
      this.injector,
      this.group().nativeElement,
      [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 8,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -8,
        },
      ],
      true,
    );
    overlay.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      }
    });
    overlay.outsidePointerEvents().subscribe((event) => {
      // The button's own click toggles it, so leave that click to the button.
      if (!this.trigger().nativeElement.contains(event.target as Node))
        this.close(false);
    });
    overlay.overlayElement.addEventListener('focusout', (event) => {
      const next = event.relatedTarget as Node | null;
      if (
        next &&
        !overlay.overlayElement.contains(next) &&
        !this.group().nativeElement.contains(next)
      )
        this.close(false);
    });
    return overlay;
  }

  writeValue(value: string | null): void {
    this.value.set(value || null);
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
