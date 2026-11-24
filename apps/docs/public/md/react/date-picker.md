# Date picker

Framework: React. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A date to type or pick, or a range of dates for a stay. Type dates in the reader's own order, or open the calendar beside them or with Alt + Down. Unlike the browser's own picker, this calendar can close off days, such as a shop's day off. For ordinary dates and times, the native fields below use the browser's localized pickers. Date values stay plain ISO dates.

Docs: https://lamsa-ui.github.io/lamsa/components/date-picker

```tsx
import { DatePicker, TextField } from '@lamsa-ui/react';
```

When to use something else:

- Pick days by looking at a month, or a range: [Calendar](https://lamsa-ui.github.io/lamsa/components/calendar)
- A time only: [Text field with type time](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the field and the calendar. |
| `min \| max` | `string` |  | Earliest and latest dates, as YYYY-MM-DD. |
| `isDisabled` | `(date: string) => boolean` |  | Days that cannot be picked, such as closed days. |
| `hint \| error` | `string` |  | Help text, and the translated error that marks it invalid. |
| `calendarLabel` | `string` | `Choose date` | Names the calendar button. Translate it. |
| `selection` | `'single' \| 'range'` | `'single'` | Shows one date field, or two fields for a date range. |
| `rangeStartLabel \| rangeEndLabel` | `string` | `'Start date' \| 'End date'` | Accessible names for the two fields in range mode. |
| `type (TextField)` | `'date' \| 'time' \| 'datetime-local' \| 'number'` |  | Use the browser native picker for dates and times, or a basic number input. |
| `min, max, step (TextField)` | `string \| number` |  | Pass the native range and step attributes through to the input. |
| `value \| defaultValue \| onChange` | `string \| DateRange \| null` |  | Controlled or starting value. Range mode takes two ISO dates. Language and order follow the nearest I18nProvider. |
| `disabled \| name` | `boolean \| string` |  | With name, the date is submitted with a form. |

## Examples

### A delivery day

No deliveries on Fridays, and none in the past. Picking a day closes the calendar and returns to the button.

```tsx
<DatePicker
  label="Delivery day"
  min="2026-11-20"
  hint="We deliver Saturday to Thursday."
  isDisabled={isFriday}
  value={day}
  onChange={setDay}
/>
```

### A stay

Type the check-in and check-out dates, or choose them in the calendar. The range starts with its first date and ends when you pick the second.

```tsx
import { useState } from 'react';
import { DatePicker, type DateRange } from '@lamsa-ui/react';

const [stay, setStay] = useState<DateRange | null>(null);

<DatePicker
  label="Stay"
  selection="range"
  rangeStartLabel="Check-in"
  rangeEndLabel="Check-out"
  value={stay}
  onChange={setStay}
/>
```

### A native date

Use the browser's own picker for a straightforward date. min and max keep it to dates that make sense.

```tsx
<TextField
  label="Move-in date"
  type="date"
  min="2026-01-01"
  hint="Any day from January 2026."
  value={moveIn}
  onChange={(e) => setMoveIn(e.target.value)}
/>
```

### A native time

The browser provides a localized time picker; step offers quarter-hour increments.

```tsx
<TextField label="Delivery time" type="time" step={900} />
```

### A native number

For a basic quantity, the browser's number input steps and checks its limits.

```tsx
<TextField
  label="Rooms"
  type="number"
  min={1}
  max={12}
  value={rooms ?? ''}
  onChange={(e) => setRooms(e.target.value === '' ? null : e.target.valueAsNumber)}
/>
```

### In Arabic

```tsx
<I18nProvider locale="ar-EG">
  <DatePicker label="يوم التوصيل" value={day} onChange={setDay} />
</I18nProvider>
```

### Native date in Arabic

```tsx
<TextField label="تاريخ الاستلام" type="date" />
```
