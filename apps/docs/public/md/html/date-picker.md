# Date picker

Framework: Plain HTML and CSS. Rules for AI assistants: https://lamsa-ui.github.io/lamsa/llms.txt

A date to type or pick, or a range of dates for a stay. Type dates in the reader's own order, or open the calendar beside them or with Alt + Down. Unlike the browser's own picker, this calendar can close off days, such as a shop's day off. For ordinary dates and times, the native fields below use the browser's localized pickers. Date values stay plain ISO dates.

Docs: https://lamsa-ui.github.io/lamsa/components/date-picker

```html
<!-- Without a framework, use a date field: the browser's own picker. -->
<input class="ui-input" type="date" />
```

When to use something else:

- Pick days by looking at a month, or a range: [Calendar](https://lamsa-ui.github.io/lamsa/components/calendar)
- A time only: [Text field with type time](https://lamsa-ui.github.io/lamsa/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `input.ui-input` | `element + class` |  | With type="date", "time", "datetime-local" or "number", inside a ui-field. |
| `ui-input-group` | `class` |  | The box around the date field and the calendar button. |
| `ui-date-picker__popover` | `class` |  | With ui-popover, the panel that holds the calendar. |

## Examples

### A delivery day

No deliveries on Fridays, and none in the past. Picking a day closes the calendar and returns to the button.

```html
<div class="ui-field">
  <label class="ui-field__label" for="day">Delivery day</label>
  <div class="ui-input-group">
    <input class="ui-input-group__input" id="day" type="date" min="2026-11-20" />
    <button type="button" class="ui-input-group__button" aria-haspopup="dialog"
      aria-expanded="false" aria-label="Choose date">
      <i class="ui-icon ui-icon-calendar"></i>
    </button>
  </div>
</div>
<!-- The button opens a .ui-popover.ui-date-picker__popover holding a .ui-calendar. -->
```

### A stay

Type the check-in and check-out dates, or choose them in the calendar. The range starts with its first date and ends when you pick the second.

```html
<label class="ui-field__label" for="stay-start">Stay</label>
<div class="ui-input-group">
  <input class="ui-input-group__input" id="stay-start" type="date" aria-label="Stay: Check-in" />
  <span class="ui-date-picker__separator" aria-hidden="true">–</span>
  <input class="ui-input-group__input" id="stay-end" type="date" aria-label="Stay: Check-out" />
  <button type="button" class="ui-input-group__button" aria-haspopup="dialog"
    aria-expanded="false" aria-label="Choose dates">
    <i class="ui-icon ui-icon-calendar"></i>
  </button>
</div>
<!-- Add a .ui-calendar with selection="range" to choose the dates together. -->
```

### A native date

Use the browser's own picker for a straightforward date. min and max keep it to dates that make sense.

```html
<div class="ui-field">
  <label class="ui-field__label" for="move-in">Move-in date</label>
  <input class="ui-input" type="date" id="move-in" min="2026-01-01" aria-describedby="move-in-hint" />
  <p class="ui-field__hint" id="move-in-hint">Any day from January 2026.</p>
</div>
```

### A native time

The browser provides a localized time picker; step offers quarter-hour increments.

```html
<input class="ui-input" type="time" id="time" step="900" />
```

### A native number

For a basic quantity, the browser's number input steps and checks its limits.

```html
<input class="ui-input" type="number" id="rooms" min="1" max="12" />
```

### In Arabic

```html
<!-- dir="rtl": the button sits on the left and the calendar runs right to left. -->
```

### Native date in Arabic

```html
<!-- dir="rtl" and lang="ar" on the page: the browser's picker follows -->
```
