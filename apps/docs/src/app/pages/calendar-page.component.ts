import { Component, signal } from '@angular/core';
import { CalendarComponent, type DateRange } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
  .toISOString()
  .slice(0, 10);

@Component({
  selector: 'app-calendar-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    CalendarComponent,
  ],
  template: `
    <app-page
      title="Calendar"
      lead="A month grid to pick a day or a range, such as a delivery day or a stay. One Tab stop: arrow keys move by day and week, Home and End go to the ends of the week, Page Up and Page Down change the month, with Shift the year. Each day is read in full, Thursday, 19 November 2026. Today is underlined and picked days are filled, so neither depends on colour. Use it when seeing the month helps: open and closed days, a range, or the weekday. For a date people already know, such as a birthday, use the date field."
      [usage]="usage"
    >
      <app-example
        title="Pick a day"
        description="Days before today and Fridays can't be picked: they are struck through and read as dimmed, but arrow keys still reach them so the week reads in order."
        [code]="single"
      >
        <div class="grid gap-3">
          <ui-calendar
            label="Delivery day"
            locale="en-GB"
            [min]="today"
            [isDisabled]="friday"
            [(value)]="day"
          />
          <p class="doc-flat text-text-muted" role="status">
            Delivery: {{ day() ?? 'not picked yet' }}
          </p>
        </div>
      </app-example>

      <app-example
        title="Pick a range"
        description="The first click is the start and the second the end, in either order. A third click starts again."
        [code]="range"
      >
        <div class="grid gap-3">
          <ui-calendar
            label="Stay"
            locale="en-GB"
            selection="range"
            [(range)]="stay"
          />
          <p class="doc-flat text-text-muted" role="status">
            Stay: {{ stay()?.start ?? '…' }} to {{ stay()?.end ?? '…' }}
          </p>
        </div>
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-calendar
          label="يوم التوصيل"
          locale="ar-EG"
          previousLabel="الشهر السابق"
          nextLabel="الشهر التالي"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class CalendarPageComponent {
  protected readonly today = today;
  protected readonly day = signal<string | null>(null);
  protected readonly stay = signal<DateRange | null>(null);
  protected readonly friday = (date: string) =>
    new Date(`${date}T00:00:00Z`).getUTCDay() === 5;

  protected readonly usage = {
    angular: `import { CalendarComponent, type DateRange } from '@lamsa-ui/angular';
// Dates are ISO strings (YYYY-MM-DD), the same as <input type="date">.`,
    react: `import { Calendar, RangeCalendar, type DateRange } from '@lamsa-ui/react';
// Dates are ISO strings (YYYY-MM-DD). Language follows the nearest I18nProvider from react-aria-components.`,
    vue: `import { Calendar, RangeCalendar, type DateRange } from '@lamsa-ui/vue';
// Dates are ISO strings (YYYY-MM-DD). Language follows the nearest I18nProvider from react-aria-components.`,
    html: `<!-- The classes only. The keyboard, roving Tab stop and day names need script:
     use the Angular or React package, or copy the markup they render. -->
<div class="ui-calendar" role="group" aria-label="Delivery day">…</div>`,
  };

  protected readonly single = {
    angular: `<ui-calendar
  label="Delivery day"
  [min]="today"
  [isDisabled]="friday"
  [(value)]="day"
/>

friday = (date: string) => new Date(\`\${date}T00:00:00Z\`).getUTCDay() === 5;`,
    react: `<Calendar
  label="Delivery day"
  min={today}
  isDisabled={friday}
  value={day}
  onChange={setDay}
/>`,
    vue: `<Calendar
  label="Delivery day"
  :min="today"
  :isDisabled="friday"
  v-model="day"
/>`,
    html: `<div class="ui-calendar" role="group" aria-label="Delivery day">
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
</div>`,
  };

  protected readonly range = {
    angular: `<ui-calendar label="Stay" selection="range" [(range)]="stay" />

stay = signal<DateRange | null>(null); // { start, end }, end is null until the second click`,
    react: `<RangeCalendar label="Stay" value={stay} onChange={setStay} />`,
    vue: `<RangeCalendar label="Stay" v-model="stay" />`,
    html: `<!-- Both ends: ui-calendar__day--selected. Days between: ui-calendar__day--in-range.
     Every day in the range has aria-selected="true" on its cell. -->`,
  };

  protected readonly arabic = {
    angular: `<ui-calendar
  label="يوم التوصيل"
  locale="ar-EG"
  previousLabel="الشهر السابق"
  nextLabel="الشهر التالي"
/>`,
    react: `import { I18nProvider } from 'react-aria-components';

<I18nProvider locale="ar-EG">
  <Calendar label="يوم التوصيل" />
</I18nProvider>`,
    vue: `import { I18nProvider } from 'react-aria-components';

<I18nProvider locale="ar-EG">
  <Calendar label="يوم التوصيل" />
</I18nProvider>`,
    html: `<!-- dir="rtl" on the page: the week runs from the right, the arrows flip. -->`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Names the calendar for screen readers. Required.',
    },
    {
      name: 'min | max',
      type: 'string',
      description:
        'Earliest and latest days that can be picked, as YYYY-MM-DD.',
    },
    {
      name: 'isDisabled',
      type: '(date: string) => boolean',
      description: 'Other days that can not be picked, such as closed days.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A date the reader already knows, such as a birthday',
      use: 'Date picker',
      path: '/components/date-picker',
    },
    {
      need: 'A time or a date and time',
      use: 'Text field with type time',
      path: '/components/text-field',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: 'selection',
        type: "'single' | 'range'",
        default: "'single'",
        description: 'One day, or a start and an end.',
      },
      {
        name: '[(value)]',
        type: 'string | null',
        description: 'The picked day when selection is single.',
      },
      {
        name: '[(range)]',
        type: 'DateRange | null',
        description:
          '{ start, end } when selection is range; end is null until the second pick.',
      },
      {
        name: 'locale',
        type: 'string',
        default: 'LOCALE_ID',
        description:
          'Month and weekday names, digits and the first day of the week.',
      },
      {
        name: 'previousLabel | nextLabel',
        type: 'string',
        default: "'Previous month' | 'Next month'",
        description: 'The arrow buttons’ names. Translate them.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'value | defaultValue',
        type: 'string | null',
        description: 'Calendar: controlled or starting day.',
      },
      {
        name: 'onChange',
        type: '(date: string) => void',
        description: 'Calendar: called with the picked day.',
      },
      {
        name: 'RangeCalendar value | onChange',
        type: 'DateRange',
        description: '{ start, end }, reported once both ends are picked.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'v-model',
        type: 'string | null',
        description: 'The chosen day as an ISO date ("2026-11-23").',
      },
      {
        name: 'RangeCalendar v-model',
        type: 'DateRange',
        description:
          '{ start, end } in ISO dates, set once both days are picked.',
      },
    ],
    html: [
      {
        name: 'ui-calendar',
        type: 'class',
        description:
          'The box; holds ui-calendar__header and ui-calendar__grid.',
      },
      {
        name: 'ui-calendar__day',
        type: 'class',
        description: 'One button per day, inside a gridcell.',
      },
      {
        name: '--today | --selected | --in-range | --disabled | --outside',
        type: 'modifier',
        description:
          'Underlined today, filled pick, range middle, struck through, hidden day of another month.',
      },
    ],
  };
}
