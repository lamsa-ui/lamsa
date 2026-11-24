# Calendar

Framework: Angular. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A month grid to pick a day or a range, such as a delivery day or a stay. One Tab stop: arrow keys move by day and week, Home and End go to the ends of the week, Page Up and Page Down change the month, with Shift the year. Each day is read in full, Thursday, 19 November 2026. Today is underlined and picked days are filled, so neither depends on colour. Use it when seeing the month helps: open and closed days, a range, or the weekday. For a date people already know, such as a birthday, use the date field.

Docs: https://lamsa-ui.github.io/lamsa/components/calendar

```ts
import { CalendarComponent, type DateRange } from '@lamsa-ui/angular';
// Dates are ISO strings (YYYY-MM-DD), the same as <input type="date">.
```

When to use something else:

- A date the reader already knows, such as a birthday: [Date picker](https://lamsa-ui.github.io/lamsa/components/date-picker)
- A time or a date and time: [Text field with type time](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `label` | `string` |  | Names the calendar for screen readers. Required. |
| `min \| max` | `string` |  | Earliest and latest days that can be picked, as YYYY-MM-DD. |
| `isDisabled` | `(date: string) => boolean` |  | Other days that can not be picked, such as closed days. |
| `selection` | `'single' \| 'range'` | `'single'` | One day, or a start and an end. |
| `[(value)]` | `string \| null` |  | The picked day when selection is single. |
| `[(range)]` | `DateRange \| null` |  | { start, end } when selection is range; end is null until the second pick. |
| `locale` | `string` | `LOCALE_ID` | Month and weekday names, digits and the first day of the week. |
| `previousLabel \| nextLabel` | `string` | `'Previous month' \| 'Next month'` | The arrow buttons’ names. Translate them. |

Keyboard and screen readers:

- Tab: Reach the grid, on the chosen or focused day.
- Left or Right: Move by a day. Flipped in Arabic.
- Up or Down: Move by a week.
- Home or End: Go to the start or end of the week.
- Page Up or Page Down: Go to the previous or next month.
- Shift + Page Up or Shift + Page Down: Go to the previous or next year.
- Enter or Space: Pick the day.
- Each day is read in full, such as Thursday, 19 November 2026.
- Today is underlined and picked days are filled, so neither depends on colour.

## Examples

### Pick a day

Days before today and Fridays can't be picked: they are struck through and read as dimmed, but arrow keys still reach them so the week reads in order.

```html
<ui-calendar
  label="Delivery day"
  [min]="today"
  [isDisabled]="friday"
  [(value)]="day"
/>

friday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay() === 5;
```

### Pick a range

The first click is the start and the second the end, in either order. A third click starts again.

```html
<ui-calendar label="Stay" selection="range" [(range)]="stay" />

stay = signal<DateRange | null>(null); // { start, end }, end is null until the second click
```

### In Arabic

```html
<ui-calendar
  label="يوم التوصيل"
  locale="ar-EG"
  previousLabel="الشهر السابق"
  nextLabel="الشهر التالي"
/>
```
