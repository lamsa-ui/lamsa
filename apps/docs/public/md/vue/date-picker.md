# Date picker

Framework: Vue 3. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A date to type or pick, or a range of dates for a stay. Type dates in the reader's own order, or open the calendar beside them or with Alt + Down. Unlike the browser's own picker, this calendar can close off days, such as a shop's day off. For ordinary dates and times, the native fields below use the browser's localized pickers. Date values stay plain ISO dates.

Docs: https://lamsa-ui.github.io/lamsa/components/date-picker

```ts
import { DatePicker, TextField } from '@lamsa-ui/vue';
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
| `selection` | `'single' \| 'range'` | `'single'` | range types a start and an end date and picks both in the calendar. |
| `rangeStartLabel \| rangeEndLabel` | `string` |  | Accessible names of the two date inputs in a range; pass the translated text. |
| `v-model` | `string \| DateRange \| null` |  | An ISO date ("2026-11-23"), or { start, end } for a range; null while incomplete. |
| `disabled \| name` | `boolean \| string` |  | As on any input. |

## Examples

### A delivery day

No deliveries on Fridays, and none in the past. Picking a day closes the calendar and returns to the button.

```vue
<DatePicker
  label="Delivery day"
  min="2026-11-20"
  hint="We deliver Saturday to Thursday."
  :isDisabled="isFriday"
  v-model="day"
/>
```

### A stay

Type the check-in and check-out dates, or choose them in the calendar. The range starts with its first date and ends when you pick the second.

```vue
<script setup lang="ts">
import { DatePicker, type DateRange } from '@lamsa-ui/vue';
import { ref } from 'vue';

const stay = ref<DateRange | null>(null);
</script>

<template>
  <DatePicker
    v-model="stay"
    label="Stay"
    selection="range"
    rangeStartLabel="Check-in"
    rangeEndLabel="Check-out"
  />
</template>
```

### A native date

Use the browser's own picker for a straightforward date. min and max keep it to dates that make sense.

```vue
<TextField
  label="Move-in date"
  type="date"
  min="2026-01-01"
  hint="Any day from January 2026."
  v-model="moveIn"
/>
```

### A native time

The browser provides a localized time picker; step offers quarter-hour increments.

```vue
<TextField label="Delivery time" type="time" :step="900" />
```

### A native number

For a basic quantity, the browser's number input steps and checks its limits.

```vue
<!-- v-model holds the typed text; use Number(rooms) when you need the number -->
<TextField v-model="rooms" label="Rooms" type="number" min="1" max="12" />
```

### In Arabic

```vue
<I18nProvider locale="ar-EG">
  <DatePicker label="يوم التوصيل" v-model="day" />
</I18nProvider>
```

### Native date in Arabic

```vue
<TextField label="تاريخ الاستلام" type="date" />
```
