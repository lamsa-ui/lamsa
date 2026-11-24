import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  LOCALE_ID,
  model,
  signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { UI_LABELS } from '../labels';

let nextId = 0;

/** A picked range, as ISO dates (YYYY-MM-DD). `end` is null until the second pick. */
export interface DateRange {
  start: string;
  end: string | null;
}

const DAY = 86_400_000;
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (iso: string, n: number) =>
  toIso(new Date(toDate(iso).getTime() + n * DAY));
/** Same day n months on, or the month's last day when it is shorter (31 Jan + 1 = 28 Feb). */
const addMonths = (iso: string, n: number) => {
  const d = toDate(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const last = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return toIso(d);
};
const monthOf = (iso: string) => `${iso.slice(0, 7)}-01`;

/** The locale's first day of the week, 0 = Sunday. */
function firstDayOf(locale: string): number {
  const l = new Intl.Locale(locale) as Intl.Locale & {
    getWeekInfo?: () => { firstDay: number };
    weekInfo?: { firstDay: number };
  };
  // ponytail: Firefox has no week info yet, so it starts on Monday; add a firstDay input if a buyer needs it.
  return ((l.getWeekInfo?.() ?? l.weekInfo)?.firstDay ?? 1) % 7;
}

/**
 * A month grid to pick a date, or a range with `selection="range"`. One Tab stop: arrow keys
 * move by day and week (flipped in Arabic), Home and End go to the week's ends, Page Up and
 * Down change the month, with Shift the year. Dates are ISO strings (YYYY-MM-DD), the same
 * as a date input's value. Names and numbers follow `locale` (ar-EG gives Arabic digits).
 *
 * ```html
 * <ui-calendar label="Delivery day" [(value)]="day" min="2026-11-19" />
 * <ui-calendar label="Stay" selection="range" [(range)]="stay" />
 * ```
 */
@Component({
  imports: [IconComponent],
  selector: 'ui-calendar',
  template: `
    <div class="ui-calendar" role="group" [attr.aria-label]="label()">
      <div class="ui-calendar__header">
        <button
          type="button"
          class="ui-button ui-button--ghost ui-button--sm ui-calendar__nav"
          [attr.aria-label]="previousLabelText()"
          [disabled]="!canGo(-1)"
          (click)="go(-1)"
        >
          <ui-icon name="chevron-left" />
        </button>
        <h2 class="ui-calendar__title" [id]="id" aria-live="polite">
          {{ title() }}
        </h2>
        <button
          type="button"
          class="ui-button ui-button--ghost ui-button--sm ui-calendar__nav"
          [attr.aria-label]="nextLabelText()"
          [disabled]="!canGo(1)"
          (click)="go(1)"
        >
          <ui-icon name="chevron-right" />
        </button>
      </div>
      <table class="ui-calendar__grid" role="grid" [attr.aria-labelledby]="id">
        <thead>
          <tr>
            @for (day of weekdays(); track day.long) {
              <th scope="col" [attr.abbr]="day.long">{{ day.short }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (week of weeks(); track $index) {
            <tr>
              @for (date of week; track $index) {
                @if (date) {
                  <td role="gridcell" [attr.aria-selected]="picked(date)">
                    <button
                      type="button"
                      class="ui-calendar__day"
                      [class.ui-calendar__day--today]="date === today"
                      [class.ui-calendar__day--selected]="ends(date)"
                      [class.ui-calendar__day--in-range]="between(date)"
                      [class.ui-calendar__day--disabled]="off(date)"
                      [attr.data-date]="date"
                      [attr.tabindex]="date === focused() ? 0 : -1"
                      [attr.aria-label]="dayName(date)"
                      [attr.aria-current]="date === today ? 'date' : null"
                      [attr.aria-disabled]="off(date) || null"
                      (click)="pick(date)"
                      (keydown)="key($event)"
                    >
                      {{ dayNumber(date) }}
                    </button>
                  </td>
                } @else {
                  <td></td>
                }
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class CalendarComponent {
  private readonly uiLabels = inject(UI_LABELS);
  /** Names the calendar: "Delivery day". */
  readonly label = input.required<string>();
  readonly selection = input<'single' | 'range'>('single');
  /** The picked date when selection is single. */
  readonly value = model<string | null>(null);
  /** The picked range when selection is range. */
  readonly range = model<DateRange | null>(null);
  /** Earliest and latest dates that can be picked, as YYYY-MM-DD. */
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);
  /** Other dates that can't be picked, such as closed days. */
  readonly isDisabled = input<(date: string) => boolean>(() => false);
  /** Month names, weekday names and digits follow this. Defaults to the app's LOCALE_ID. */
  readonly locale = input(inject(LOCALE_ID));
  readonly previousLabel = input<string>();
  protected readonly previousLabelText = computed(
    () => this.previousLabel() ?? this.uiLabels().previousMonth,
  );
  readonly nextLabel = input<string>();
  protected readonly nextLabelText = computed(
    () => this.nextLabel() ?? this.uiLabels().nextMonth,
  );

  protected readonly id = `ui-calendar-${nextId++}`;
  protected readonly today = toIso(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60_000),
  );
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly injector = inject(Injector);
  /** The day with the Tab stop; its month is the one shown. Null = follow the value. */
  private readonly moved = signal<string | null>(null);

  protected readonly focused = computed(() =>
    this.clamp(
      this.moved() ??
        (this.selection() === 'range' ? this.range()?.start : this.value()) ??
        this.today,
    ),
  );
  private readonly format = computed(
    () => (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(this.locale(), { timeZone: 'UTC', ...options }),
  );
  protected readonly title = computed(() =>
    this.format()({ month: 'long', year: 'numeric' }).format(
      toDate(this.focused()),
    ),
  );
  private readonly firstDay = computed(() => firstDayOf(this.locale()));
  protected readonly weekdays = computed(() => {
    const long = this.format()({ weekday: 'long' });
    const short = this.format()({ weekday: 'narrow' });
    // 2023-01-01 was a Sunday.
    return Array.from({ length: 7 }, (_, i) => {
      const d = toDate(addDays('2023-01-01', (this.firstDay() + i) % 7));
      return { long: long.format(d), short: short.format(d) };
    });
  });
  protected readonly weeks = computed(() => {
    const first = monthOf(this.focused());
    const lead = (toDate(first).getUTCDay() - this.firstDay() + 7) % 7;
    const cells: (string | null)[] = Array(lead).fill(null);
    for (let d = first; d.startsWith(first.slice(0, 7)); d = addDays(d, 1)) {
      cells.push(d);
    }
    while (cells.length % 7) cells.push(null);
    return Array.from({ length: cells.length / 7 }, (_, i) =>
      cells.slice(i * 7, i * 7 + 7),
    );
  });
  private readonly dayFormat = computed(() => ({
    long: this.format()({
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    short: this.format()({ day: 'numeric' }),
  }));

  protected dayName = (date: string) =>
    this.dayFormat().long.format(toDate(date));
  protected dayNumber = (date: string) =>
    this.dayFormat().short.format(toDate(date));

  protected off(date: string): boolean {
    const min = this.min();
    const max = this.max();
    return (
      (!!min && date < min) || (!!max && date > max) || this.isDisabled()(date)
    );
  }

  /** Filled: the single date, or a range's two ends. */
  protected ends(date: string): boolean {
    if (this.selection() === 'single') return date === this.value();
    const r = this.range();
    return !!r && (date === r.start || date === r.end);
  }

  protected between(date: string): boolean {
    const r = this.range();
    return (
      this.selection() === 'range' && !!r?.end && date > r.start && date < r.end
    );
  }

  protected picked(date: string): boolean {
    return this.ends(date) || this.between(date);
  }

  protected pick(date: string): void {
    if (this.off(date)) return;
    this.moved.set(date);
    if (this.selection() === 'single') {
      this.value.set(date);
      return;
    }
    const r = this.range();
    if (!r || r.end) {
      this.range.set({ start: date, end: null });
    } else {
      this.range.set(
        date < r.start
          ? { start: date, end: r.start }
          : { start: r.start, end: date },
      );
    }
  }

  protected canGo(months: number): boolean {
    const target = monthOf(addMonths(monthOf(this.focused()), months));
    const min = this.min();
    const max = this.max();
    return months < 0
      ? !min || target >= monthOf(min)
      : !max || target <= monthOf(max);
  }

  protected go(months: number): void {
    this.moved.set(this.clamp(addMonths(this.focused(), months)));
  }

  protected key(event: KeyboardEvent): void {
    const from = this.focused();
    const rtl = getComputedStyle(this.host.nativeElement).direction === 'rtl';
    const ahead = rtl ? -1 : 1;
    const weekday = (toDate(from).getUTCDay() - this.firstDay() + 7) % 7;
    const to = {
      ArrowRight: () => addDays(from, ahead),
      ArrowLeft: () => addDays(from, -ahead),
      ArrowDown: () => addDays(from, 7),
      ArrowUp: () => addDays(from, -7),
      Home: () => addDays(from, -weekday),
      End: () => addDays(from, 6 - weekday),
      PageDown: () => addMonths(from, event.shiftKey ? 12 : 1),
      PageUp: () => addMonths(from, event.shiftKey ? -12 : -1),
    }[event.key];
    if (!to) return;
    event.preventDefault();
    this.moved.set(this.clamp(to()));
    afterNextRender(
      () =>
        this.host.nativeElement
          .querySelector<HTMLElement>(`[data-date="${this.focused()}"]`)
          ?.focus(),
      { injector: this.injector },
    );
  }

  private clamp(date: string): string {
    const min = this.min();
    const max = this.max();
    return min && date < min ? min : max && date > max ? max : date;
  }
}
