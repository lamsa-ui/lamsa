'use client';

import {
  parseDate,
  toCalendarDate,
  type DateValue,
} from '@internationalized/date';
import type { Ref } from 'react';
import {
  Button,
  Calendar as AriaCalendar,
  DateInput,
  DatePicker as AriaDatePicker,
  DateRangePicker as AriaDateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Label,
  Popover,
  RangeCalendar as AriaRangeCalendar,
} from 'react-aria-components';
import { date, Month, type DateRange } from './calendar.js';
import { cx } from './class-names.js';
import { Hint } from './fields.js';
import { Icon } from './icon.js';
import { useUiLabels } from './labels.js';

interface SharedDatePickerProps {
  label: string;
  /** Earliest and latest dates, as YYYY-MM-DD. */
  min?: string;
  max?: string;
  /** Dates that can't be picked or typed, such as closed days. */
  isDisabled?: (date: string) => boolean;
  hint?: string;
  /** The translated error. Marks the field invalid and announces the message. */
  error?: string;
  /** Names the calendar button; by default React Aria's translated "Calendar". */
  calendarLabel?: string;
  disabled?: boolean;
  /** Form field name. */
  name?: string;
  onBlur?: () => void;
  /** Ref to the date segment group, for form-library focus management. */
  ref?: Ref<HTMLDivElement>;
  /** data-testid on the date's segments group, for tests. */
  testId?: string;
  className?: string;
}

export interface SingleDatePickerProps extends SharedDatePickerProps {
  selection?: 'single';
  /** The date as YYYY-MM-DD, or null while empty. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (date: string | null) => void;
}

export interface RangeDatePickerProps extends SharedDatePickerProps {
  selection: 'range';
  /** The complete range as ISO dates, or null while empty. */
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onChange?: (range: DateRange | null) => void;
  /** Translated accessible names for the range's two date fields. */
  rangeStartLabel?: string;
  rangeEndLabel?: string;
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

const dateRange = (range?: DateRange | null) =>
  range ? { start: parseDate(range.start), end: parseDate(range.end) } : range;

/**
 * A date to type or to pick, on React Aria. The date is typed in segments (day, month, year,
 * in the reader's order), each a spin button; the button beside it opens a calendar, which
 * can close off dates. Alt + Down opens it from the field. In range mode, two date fields
 * and a range calendar select the start and end dates.
 *
 * ```tsx
 * <DatePicker label="Delivery day" min="2026-11-20" value={day} onChange={setDay} />
 * <DatePicker label="Stay" selection="range" value={stay} onChange={setStay} />
 * ```
 */
export function DatePicker(props: DatePickerProps) {
  return props.selection === 'range' ? (
    <RangeDatePicker {...props} />
  ) : (
    <SingleDatePicker {...props} />
  );
}

function SingleDatePicker({
  label,
  value,
  defaultValue,
  onChange,
  min,
  max,
  isDisabled,
  hint,
  error,
  calendarLabel,
  disabled,
  onBlur,
  ref,
  testId,
  className,
  ...field
}: SingleDatePickerProps) {
  return (
    <AriaDatePicker
      {...field}
      granularity="day"
      value={date(value)}
      defaultValue={date(defaultValue)}
      onChange={(d) => onChange?.(d ? toCalendarDate(d).toString() : null)}
      minValue={date(min)}
      maxValue={date(max)}
      isDateUnavailable={
        isDisabled &&
        ((d: DateValue) => isDisabled(toCalendarDate(d).toString()))
      }
      isDisabled={disabled}
      isInvalid={!!error}
      onBlur={onBlur}
      className={cx(
        'ui-field ui-date-picker',
        error && 'ui-field--invalid',
        className,
      )}
    >
      <Label className="ui-field__label">{label}</Label>
      <Group className="ui-input-group">
        <DateInput ref={ref} className="ui-date-input" data-testid={testId}>
          {(segment) => (
            <DateSegment segment={segment} className="ui-date-input__segment" />
          )}
        </DateInput>
        <Button className="ui-input-group__button" aria-label={calendarLabel}>
          <Icon name="calendar" />
        </Button>
      </Group>
      <Hint hint={hint} error={error} />
      <Popover
        placement="bottom start"
        offset={8}
        style={{ zIndex: 'var(--ui-layer-popover)' }}
      >
        <Dialog className="ui-popover ui-date-picker__popover">
          <AriaCalendar className="ui-calendar">
            <Month />
          </AriaCalendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}

function RangeDatePicker({
  label,
  value,
  defaultValue,
  onChange,
  min,
  max,
  isDisabled,
  hint,
  error,
  calendarLabel,
  disabled,
  onBlur,
  ref,
  testId,
  className,
  rangeStartLabel,
  rangeEndLabel,
  ...field
}: RangeDatePickerProps) {
  const t = useUiLabels();
  rangeStartLabel ??= t.startDate;
  rangeEndLabel ??= t.endDate;
  return (
    <AriaDateRangePicker
      {...field}
      value={dateRange(value)}
      defaultValue={dateRange(defaultValue)}
      onChange={(range) =>
        onChange?.(
          range
            ? { start: range.start.toString(), end: range.end.toString() }
            : null,
        )
      }
      minValue={date(min)}
      maxValue={date(max)}
      isDateUnavailable={
        isDisabled &&
        ((d: DateValue) => isDisabled(toCalendarDate(d).toString()))
      }
      isDisabled={disabled}
      isInvalid={!!error}
      onBlur={onBlur}
      className={cx(
        'ui-field ui-date-picker',
        error && 'ui-field--invalid',
        className,
      )}
    >
      <Label className="ui-field__label">{label}</Label>
      <Group className="ui-input-group">
        <DateInput
          ref={ref}
          slot="start"
          className="ui-date-input"
          data-testid={testId}
          aria-label={`${label}: ${rangeStartLabel}`}
        >
          {(segment) => (
            <DateSegment segment={segment} className="ui-date-input__segment" />
          )}
        </DateInput>
        <span className="ui-date-picker__separator" aria-hidden="true">
          –
        </span>
        <DateInput
          slot="end"
          className="ui-date-input"
          data-testid={testId ? `${testId}-end` : undefined}
          aria-label={`${label}: ${rangeEndLabel}`}
        >
          {(segment) => (
            <DateSegment segment={segment} className="ui-date-input__segment" />
          )}
        </DateInput>
        <Button className="ui-input-group__button" aria-label={calendarLabel}>
          <Icon name="calendar" />
        </Button>
      </Group>
      <Hint hint={hint} error={error} />
      <Popover
        placement="bottom start"
        offset={8}
        style={{ zIndex: 'var(--ui-layer-popover)' }}
      >
        <Dialog className="ui-popover ui-date-picker__popover">
          <AriaRangeCalendar className="ui-calendar">
            <Month inRange />
          </AriaRangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}
