# Calendar

Framework: Plain HTML and CSS. Rules for AI assistants: https://ghazal-ui.github.io/ghazal/llms.txt

A month grid to pick a day or a range, such as a delivery day or a stay. One Tab stop: arrow keys move by day and week, Home and End go to the ends of the week, Page Up and Page Down change the month, with Shift the year. Each day is read in full, Thursday, 19 November 2026. Today is underlined and picked days are filled, so neither depends on colour. Use it when seeing the month helps: open and closed days, a range, or the weekday. For a date people already know, such as a birthday, use the date field.

Docs: https://ghazal-ui.github.io/ghazal/components/calendar

```html
<!-- The classes only. The keyboard, roving Tab stop and day names need script:
     use the Angular or React package, or copy the markup they render. -->
<div class="ui-calendar" role="group" aria-label="Delivery day">…</div>
```

When to use something else:

- A date the reader already knows, such as a birthday: [Date picker](https://ghazal-ui.github.io/ghazal/components/date-picker)
- A time or a date and time: [Text field with type time](https://ghazal-ui.github.io/ghazal/components/text-field)

| Name | Type | Default | What it does |
| --- | --- | --- | --- |
| `ui-calendar` | `class` |  | The box; holds ui-calendar__header and ui-calendar__grid. |
| `ui-calendar__day` | `class` |  | One button per day, inside a gridcell. |
| `--today \| --selected \| --in-range \| --disabled \| --outside` | `modifier` |  | Underlined today, filled pick, range middle, struck through, hidden day of another month. |

Keyboard and screen readers:

In plain HTML these keys come from your own script, following the matching WAI-ARIA pattern.

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
<div class="ui-calendar" role="group" aria-label="Delivery day">
  <div class="ui-calendar__header">
    <button type="button" class="ui-button ui-button--ghost ui-button--sm ui-calendar__nav" aria-label="Previous month">
      <i class="ui-icon ui-icon-chevron-left" aria-hidden="true"></i>
    </button>
    <h2 class="ui-calendar__title" id="cal-title" aria-live="polite">November 2026</h2>
    <button type="button" class="ui-button ui-button--ghost ui-button--sm ui-calendar__nav" aria-label="Next month">
      <i class="ui-icon ui-icon-chevron-right" aria-hidden="true"></i>
    </button>
  </div>
  <table class="ui-calendar__grid" role="grid" aria-labelledby="cal-title">
    <thead><tr><th scope="col" abbr="Monday">M</th><!-- … 7 days --></tr></thead>
    <tbody>
      <tr>
        <td></td><!-- blank cells before the 1st -->
        <td role="gridcell" aria-selected="false">
          <button type="button" class="ui-calendar__day ui-calendar__day--disabled" tabindex="-1"
            aria-label="Sunday, 1 November 2026" aria-disabled="true">1</button>
        </td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="true">
          <button type="button" class="ui-calendar__day ui-calendar__day--today ui-calendar__day--selected"
            tabindex="0" aria-label="Thursday, 19 November 2026" aria-current="date">19</button>
        </td>
        <!-- … -->
      </tr>
    </tbody>
  </table>
</div>
```

### Pick a range

The first click is the start and the second the end, in either order. A third click starts again.

```html
<!-- Both ends: ui-calendar__day--selected. Days between: ui-calendar__day--in-range.
     Every day in the range has aria-selected="true" on its cell. -->
```

### In Arabic

```html
<!-- dir="rtl" on the page: the week runs from the right, the arrows flip. -->
```
