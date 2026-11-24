import {
  parseDate,
  toCalendarDate,
  type DateValue,
} from '@internationalized/date';
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui';
import {
  defineComponent,
  h,
  ref,
  useId,
  type Component,
  type PropType,
  type VNodeChild,
} from 'vue';
import { Icon } from './content.js';

export interface DateRange {
  start: string;
  end: string;
}

/** ISO yyyy-mm-dd ↔ the date objects Reka works with. */
const toDate = (iso?: string | null) => (iso ? parseDate(iso) : undefined);
const toRange = (r?: DateRange | null) =>
  r ? { start: parseDate(r.start), end: parseDate(r.end) } : undefined;
const fromDate = (d?: DateValue | null) =>
  d ? toCalendarDate(d).toString() : null;
const unavailable =
  (isDisabled?: (iso: string) => boolean) =>
  (d: DateValue): boolean =>
    !!isDisabled?.(toCalendarDate(d).toString());

/** The same month view for every family of Reka parts (calendar, range calendar, pickers). */
type Family = 'Calendar' | 'RangeCalendar' | 'DatePicker' | 'DateRangePicker';
const PARTS: Record<string, Component> = {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
};
const part = (family: Family, name: string) => PARTS[`${family}${name}`];

interface CellSlot {
  dayValue: string;
  disabled: boolean;
  selected: boolean;
  today: boolean;
  outsideView: boolean;
  unavailable: boolean;
  selectionStart?: boolean;
  selectionEnd?: boolean;
}

function month(
  family: Family,
  inRange: boolean,
  {
    grid,
    weekDays,
  }: { grid: { value: unknown; rows: unknown[][] }[]; weekDays: string[] },
): VNodeChild {
  const P = (n: string) => part(family, n);
  return [
    h(P('Header'), { class: 'ui-calendar__header' }, () => [
      h(
        P('Prev'),
        { class: 'ui-button ui-button--ghost ui-button--sm ui-calendar__nav' },
        () => h(Icon, { name: 'chevron-left' }),
      ),
      h(P('Heading'), { class: 'ui-calendar__title', as: 'h2' }),
      h(
        P('Next'),
        { class: 'ui-button ui-button--ghost ui-button--sm ui-calendar__nav' },
        () => h(Icon, { name: 'chevron-right' }),
      ),
    ]),
    ...grid.map((m) =>
      h(P('Grid'), { class: 'ui-calendar__grid' }, () => [
        h(P('GridHead'), null, () =>
          h(P('GridRow'), null, () =>
            weekDays.map((d) => h(P('HeadCell'), { key: d }, () => d)),
          ),
        ),
        h(P('GridBody'), null, () =>
          m.rows.map((week, w) =>
            h(P('GridRow'), { key: w }, () =>
              week.map((d) =>
                h(P('Cell'), { key: String(d), date: d }, () =>
                  h(
                    P('CellTrigger'),
                    { day: d, month: m.value },
                    {
                      default: (s: CellSlot) => {
                        const middle =
                          inRange && !s.selectionStart && !s.selectionEnd;
                        return h(
                          'span',
                          {
                            class: [
                              'ui-calendar__day',
                              s.today && 'ui-calendar__day--today',
                              s.selected &&
                                (middle
                                  ? 'ui-calendar__day--in-range'
                                  : 'ui-calendar__day--selected'),
                              (s.disabled || s.unavailable) &&
                                'ui-calendar__day--disabled',
                              s.outsideView && 'ui-calendar__day--outside',
                            ],
                          },
                          s.dayValue,
                        );
                      },
                    },
                  ),
                ),
              ),
            ),
          ),
        ),
      ]),
    ),
  ];
}

const sharedProps = {
  /** Names the calendar grid. */
  label: { type: String, required: true },
  min: String,
  max: String,
  /** Days to block, such as closed days: return true to disable. */
  isDisabled: Function as PropType<(date: string) => boolean>,
} as const;

export interface CalendarProps {
  modelValue?: string | null;
  label: string;
  min?: string;
  max?: string;
  isDisabled?: (date: string) => boolean;
}

/** A month to pick one day from. v-model is an ISO date string ("2026-11-23"). */
export const Calendar = defineComponent({
  name: 'UiCalendar',
  props: { modelValue: String as PropType<string | null>, ...sharedProps },
  emits: { 'update:modelValue': (_date: string) => true },
  setup(props, { emit }) {
    return () =>
      h(
        CalendarRoot,
        {
          class: 'ui-calendar',
          'aria-label': props.label,
          modelValue: toDate(props.modelValue),
          minValue: toDate(props.min),
          maxValue: toDate(props.max),
          isDateUnavailable: unavailable(props.isDisabled),
          weekdayFormat: 'short',
          'onUpdate:modelValue': (d?: DateValue) => {
            const iso = fromDate(d);
            if (iso) emit('update:modelValue', iso);
          },
        },
        {
          default: (slot: Parameters<typeof month>[2]) =>
            month('Calendar', false, slot),
        },
      );
  },
});

export interface RangeCalendarProps {
  modelValue?: DateRange | null;
  label: string;
  min?: string;
  max?: string;
  isDisabled?: (date: string) => boolean;
}

/** A month to pick a start and an end day from. v-model is { start, end } in ISO dates. */
export const RangeCalendar = defineComponent({
  name: 'UiRangeCalendar',
  props: { modelValue: Object as PropType<DateRange | null>, ...sharedProps },
  emits: { 'update:modelValue': (_range: DateRange) => true },
  setup(props, { emit }) {
    return () =>
      h(
        RangeCalendarRoot,
        {
          class: 'ui-calendar',
          'aria-label': props.label,
          modelValue: toRange(props.modelValue),
          minValue: toDate(props.min),
          maxValue: toDate(props.max),
          isDateUnavailable: unavailable(props.isDisabled),
          weekdayFormat: 'short',
          'onUpdate:modelValue': (r: {
            start?: DateValue;
            end?: DateValue;
          }) => {
            const start = fromDate(r?.start);
            const end = fromDate(r?.end);
            if (start && end) emit('update:modelValue', { start, end });
          },
        },
        {
          default: (slot: Parameters<typeof month>[2]) =>
            month('RangeCalendar', true, slot),
        },
      );
  },
});

const message = (kind: 'hint' | 'error', id: string, text?: string) =>
  text
    ? h(
        'p',
        {
          class: `ui-field__${kind}`,
          id: `${id}-${kind}`,
          ...(kind === 'error' ? { role: 'alert' } : {}),
        },
        text,
      )
    : null;

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
  undefined;

/** The typed date: one segment per part (day, month, year), in the reader's locale order. */
function segments(
  family: 'DatePicker' | 'DateRangePicker',
  list: { part: string; value: string }[],
  type?: 'start' | 'end',
) {
  return list.map((s, i) =>
    h(
      part(family, 'Input'),
      {
        key: `${s.part}-${i}`,
        part: s.part,
        type,
        class: 'ui-date-input__segment',
        'data-type': s.part,
      },
      () => s.value,
    ),
  );
}

export interface DatePickerProps {
  modelValue?: string | DateRange | null;
  label: string;
  /** 'range' picks a start and an end date; v-model is then { start, end }. */
  selection?: 'single' | 'range';
  min?: string;
  max?: string;
  isDisabled?: (date: string) => boolean;
  hint?: string;
  error?: string;
  /** Accessible name of the calendar button; pass the translated text. */
  calendarLabel?: string;
  rangeStartLabel?: string;
  rangeEndLabel?: string;
  disabled?: boolean;
  name?: string;
  testId?: string;
}

/** A typed date with a calendar button. Typing works in every locale; the calendar is optional. */
export const DatePicker = defineComponent({
  name: 'UiDatePicker',
  props: {
    modelValue: [String, Object] as PropType<string | DateRange | null>,
    ...sharedProps,
    selection: {
      type: String as PropType<'single' | 'range'>,
      default: 'single',
    },
    hint: String,
    error: String,
    calendarLabel: { type: String, default: 'Choose date' },
    rangeStartLabel: { type: String, default: 'Start date' },
    rangeEndLabel: { type: String, default: 'End date' },
    disabled: Boolean,
    name: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: string | DateRange | null) => true,
  },
  setup(props, { emit }) {
    const id = useId();
    const open = ref(false);
    return () => {
      const range = props.selection === 'range';
      const family = range ? 'DateRangePicker' : 'DatePicker';
      const P = (n: string) => part(family, n);
      return h(
        'div',
        {
          class: [
            'ui-field ui-date-picker',
            props.error && 'ui-field--invalid',
          ],
        },
        [
          h(
            'span',
            { class: 'ui-field__label', id: `${id}-label` },
            props.label,
          ),
          h(
            P('Root'),
            {
              id,
              open: open.value,
              'onUpdate:open': (v: boolean) => (open.value = v),
              modelValue: range
                ? toRange(props.modelValue as DateRange | null)
                : toDate(props.modelValue as string | null),
              'onUpdate:modelValue': (v: unknown) => {
                if (range) {
                  const r = v as
                    { start?: DateValue; end?: DateValue } | undefined;
                  const start = fromDate(r?.start);
                  const end = fromDate(r?.end);
                  emit(
                    'update:modelValue',
                    start && end ? { start, end } : null,
                  );
                } else emit('update:modelValue', fromDate(v as DateValue));
              },
              granularity: 'day',
              minValue: toDate(props.min),
              maxValue: toDate(props.max),
              isDateUnavailable: unavailable(props.isDisabled),
              disabled: props.disabled,
              name: props.name,
              weekdayFormat: 'short',
            },
            () => [
              h(
                P('Field'),
                {
                  class: 'ui-input-group',
                  'aria-labelledby': `${id}-label`,
                  'aria-describedby': describedBy(id, props.hint, props.error),
                  'aria-invalid': props.error ? 'true' : undefined,
                  'data-testid': props.testId,
                },
                {
                  default: ({ segments: s }: { segments: unknown }) =>
                    range
                      ? [
                          h(
                            'span',
                            {
                              class: 'ui-date-input',
                              role: 'group',
                              'aria-label': `${props.label}: ${props.rangeStartLabel}`,
                            },
                            segments(
                              family,
                              (
                                s as {
                                  start: { part: string; value: string }[];
                                }
                              ).start,
                              'start',
                            ),
                          ),
                          h(
                            'span',
                            {
                              class: 'ui-date-picker__separator',
                              'aria-hidden': 'true',
                            },
                            '–',
                          ),
                          h(
                            'span',
                            {
                              class: 'ui-date-input',
                              role: 'group',
                              'aria-label': `${props.label}: ${props.rangeEndLabel}`,
                            },
                            segments(
                              family,
                              (s as { end: { part: string; value: string }[] })
                                .end,
                              'end',
                            ),
                          ),
                          trigger(),
                        ]
                      : [
                          h(
                            'span',
                            { class: 'ui-date-input' },
                            segments(
                              family,
                              s as { part: string; value: string }[],
                            ),
                          ),
                          trigger(),
                        ],
                },
              ),
              h(
                P('Content'),
                {
                  side: 'bottom',
                  align: 'start',
                  sideOffset: 8,
                  class: 'ui-popover ui-date-picker__popover',
                  style: { zIndex: 'var(--ui-layer-popover)' },
                },
                () =>
                  h(
                    P('Calendar'),
                    { class: 'ui-calendar' },
                    {
                      default: (slot: Parameters<typeof month>[2]) =>
                        month(family, range, slot),
                    },
                  ),
              ),
            ],
          ),
          message('hint', id, props.hint),
          message('error', id, props.error),
        ],
      );

      function trigger() {
        return h(
          P('Trigger'),
          {
            class: 'ui-input-group__button',
            'aria-label': props.calendarLabel,
          },
          () => h(Icon, { name: 'calendar' }),
        );
      }
    };
  },
});

export interface NumberFieldProps {
  modelValue?: number | null;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  /** Intl.NumberFormat options: currency, percent, units. */
  formatOptions?: Intl.NumberFormatOptions;
  hint?: string;
  error?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  disabled?: boolean;
  name?: string;
  testId?: string;
}

/** A number with − and + buttons, formatted for the reader's locale. Arrow keys step it. */
export const NumberField = defineComponent({
  name: 'UiNumberField',
  props: {
    modelValue: { type: Number as PropType<number | null>, default: undefined },
    label: { type: String, required: true },
    min: Number,
    max: Number,
    step: Number,
    formatOptions: Object as PropType<Intl.NumberFormatOptions>,
    hint: String,
    error: String,
    decrementLabel: { type: String, default: 'Decrease' },
    incrementLabel: { type: String, default: 'Increase' },
    disabled: Boolean,
    name: String,
    testId: String,
  },
  emits: { 'update:modelValue': (_value: number | null) => true },
  setup(props, { emit }) {
    const id = useId();
    return () =>
      h(
        NumberFieldRoot,
        {
          id: `${id}-root`,
          class: [
            'ui-field ui-number-field',
            props.error && 'ui-field--invalid',
          ],
          modelValue: props.modelValue ?? undefined,
          'onUpdate:modelValue': (v: number | undefined) =>
            emit(
              'update:modelValue',
              v === undefined || Number.isNaN(v) ? null : v,
            ),
          min: props.min,
          max: props.max,
          step: props.step,
          formatOptions: props.formatOptions,
          disabled: props.disabled,
          name: props.name,
        },
        () => [
          h('label', { class: 'ui-field__label', for: id }, props.label),
          h('div', { class: 'ui-input-group' }, [
            h(
              NumberFieldDecrement,
              {
                class: 'ui-input-group__button',
                'aria-label': props.decrementLabel,
              },
              () => h(Icon, { name: 'minus' }),
            ),
            h(NumberFieldInput, {
              id,
              class: 'ui-input-group__input',
              'data-testid': props.testId,
              'aria-invalid': props.error ? 'true' : undefined,
              'aria-describedby': describedBy(id, props.hint, props.error),
            }),
            h(
              NumberFieldIncrement,
              {
                class: 'ui-input-group__button',
                'aria-label': props.incrementLabel,
              },
              () => h(Icon, { name: 'plus' }),
            ),
          ]),
          message('hint', id, props.hint),
          message('error', id, props.error),
        ],
      );
  },
});

export interface SearchFieldProps {
  modelValue?: string;
  label: string;
  /** Keep the label for screen readers only, when a search icon and placeholder say enough. */
  hideLabel?: boolean;
  placeholder?: string;
  hint?: string;
  /** Accessible name of the clear button; pass the translated text. */
  clearLabel?: string;
  disabled?: boolean;
  name?: string;
  testId?: string;
}

/** A search input with a clear button. Enter fires @search; Escape clears. */
export const SearchField = defineComponent({
  name: 'UiSearchField',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, required: true },
    hideLabel: Boolean,
    placeholder: String,
    hint: String,
    clearLabel: { type: String, default: 'Clear search' },
    disabled: Boolean,
    name: String,
    testId: String,
  },
  emits: {
    'update:modelValue': (_value: string) => true,
    search: (_value: string) => true,
    blur: (_event: FocusEvent) => true,
  },
  setup(props, { attrs, emit }) {
    const id = useId();
    const input = ref<HTMLInputElement>();
    const value = ref(props.modelValue);
    const set = (v: string) => {
      value.value = v;
      emit('update:modelValue', v);
    };
    return () => {
      const current = props.modelValue || value.value;
      return h('div', { class: 'ui-field ui-search-field' }, [
        h(
          'label',
          {
            class: ['ui-field__label', props.hideLabel && 'ui-visually-hidden'],
            for: id,
          },
          props.label,
        ),
        h('div', { class: 'ui-input-group' }, [
          h(
            'span',
            { class: 'ui-input-group__addon', 'aria-hidden': 'true' },
            h(Icon, { name: 'search' }),
          ),
          h('input', {
            ...attrs,
            ref: input,
            id,
            type: 'search',
            class: 'ui-input-group__input',
            enterkeyhint: 'search',
            placeholder: props.placeholder,
            disabled: props.disabled,
            name: props.name,
            value: current,
            'data-testid': props.testId,
            'aria-describedby': props.hint ? `${id}-hint` : undefined,
            onInput: (e: Event) => set((e.target as HTMLInputElement).value),
            onKeydown: (e: KeyboardEvent) => {
              if (e.key === 'Enter') emit('search', current);
              else if (e.key === 'Escape' && current) {
                e.preventDefault();
                set('');
              }
            },
            onBlur: (e: FocusEvent) => emit('blur', e),
          }),
          current && !props.disabled
            ? h(
                'button',
                {
                  type: 'button',
                  class: 'ui-input-group__button',
                  'aria-label': props.clearLabel,
                  onClick: () => {
                    set('');
                    input.value?.focus();
                  },
                },
                h(Icon, { name: 'x' }),
              )
            : null,
        ]),
        message('hint', id, props.hint),
      ]);
    };
  },
});
