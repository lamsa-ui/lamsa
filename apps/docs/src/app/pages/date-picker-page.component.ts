import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DatePickerComponent,
  TextFieldComponent,
  type DateRange,
} from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

const isFriday = (date: string) =>
  new Date(`${date}T00:00:00Z`).getUTCDay() === 5;

@Component({
  selector: 'app-date-picker-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    DatePickerComponent,
    TextFieldComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Date picker"
      lead="A date to type or pick, or a range of dates for a stay. Type dates in the reader's own order, or open the calendar beside them or with Alt + Down. Unlike the browser's own picker, this calendar can close off days, such as a shop's day off. For ordinary dates and times, the native fields below use the browser's localized pickers. Date values stay plain ISO dates."
      [usage]="usage"
    >
      <app-example
        title="A delivery day"
        description="No deliveries on Fridays, and none in the past. Picking a day closes the calendar and returns to the button."
        [code]="basic"
      >
        <ui-date-picker
          label="Delivery day"
          min="2026-11-20"
          hint="We deliver Saturday to Thursday."
          class="doc-field"
          [isDisabled]="isFriday"
          [formControl]="day"
        />
      </app-example>

      <app-example
        title="A stay"
        description="Type the check-in and check-out dates, or choose them in the calendar. The range starts with its first date and ends when you pick the second."
        [code]="rangeExample"
      >
        <ui-date-picker
          label="Stay"
          selection="range"
          rangeStartLabel="Check-in"
          rangeEndLabel="Check-out"
          class="doc-field"
          [(range)]="stay"
        />
      </app-example>

      <app-example
        title="A native date"
        description="Use the browser's own picker for a straightforward date. min and max keep it to dates that make sense."
        [code]="date"
      >
        <ui-text-field
          label="Move-in date"
          type="date"
          min="2026-01-01"
          hint="Any day from January 2026."
          class="doc-field"
        />
      </app-example>

      <app-example
        title="A native time"
        description="The browser provides a localized time picker; step offers quarter-hour increments."
        [code]="time"
      >
        <ui-text-field
          label="Delivery time"
          type="time"
          step="900"
          class="doc-field"
        />
      </app-example>

      <app-example
        title="A native number"
        description="For a basic quantity, the browser's number input steps and checks its limits."
        [code]="number"
      >
        <ui-text-field
          label="Rooms"
          type="number"
          [min]="1"
          [max]="12"
          class="doc-field"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-date-picker
          label="يوم التوصيل"
          locale="ar-EG"
          calendarLabel="اختر التاريخ"
          previousLabel="الشهر السابق"
          nextLabel="الشهر التالي"
          class="doc-field"
          [formControl]="dayArabic"
        />
      </app-example>

      <app-example
        title="Native date in Arabic"
        [rtl]="true"
        [code]="nativeArabic"
      >
        <ui-text-field label="تاريخ الاستلام" type="date" class="doc-field" />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class DatePickerPageComponent {
  protected readonly isFriday = isFriday;
  protected readonly day = new FormControl<string | null>(null);
  protected readonly dayArabic = new FormControl<string | null>('2026-12-01');
  protected readonly stay = signal<DateRange | null>(null);

  protected readonly usage = {
    angular: `import { DatePickerComponent, TextFieldComponent } from '@lamsa-ui/angular';
// The value is an ISO date (YYYY-MM-DD), or null.
// For the browser's own date and time pickers, use TextFieldComponent.`,
    react: `import { DatePicker, TextField } from '@lamsa-ui/react';`,
    vue: `import { DatePicker, TextField } from '@lamsa-ui/vue';`,
    html: `<!-- Without a framework, use a date field: the browser's own picker. -->
<input class="ui-input" type="date" />`,
  };

  protected readonly basic = {
    angular: `<ui-date-picker
  label="Delivery day"
  min="2026-11-20"
  hint="We deliver Saturday to Thursday."
  [isDisabled]="isFriday"
  formControlName="day"
/>

isFriday = (date: string) => new Date(date + 'T00:00:00Z').getUTCDay() === 5;`,
    react: `<DatePicker
  label="Delivery day"
  min="2026-11-20"
  hint="We deliver Saturday to Thursday."
  isDisabled={isFriday}
  value={day}
  onChange={setDay}
/>`,
    vue: `<DatePicker
  label="Delivery day"
  min="2026-11-20"
  hint="We deliver Saturday to Thursday."
  :isDisabled="isFriday"
  v-model="day"
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="day">Delivery day</label>
  <div class="ui-input-group">
    <input class="ui-input-group__input" id="day" type="date" min="2026-11-20" />
    <button type="button" class="ui-input-group__button" aria-haspopup="dialog"
      aria-expanded="false" aria-label="Choose date">
      <i class="ui-icon ui-icon-calendar"></i>
    </button>
  </div>
</div>
<!-- The button opens a .ui-popover.ui-date-picker__popover holding a .ui-calendar. -->`,
  };

  protected readonly rangeExample = {
    angular: `<ui-date-picker
  label="Stay"
  selection="range"
  rangeStartLabel="Check-in"
  rangeEndLabel="Check-out"
  [(range)]="stay"
/>`,
    react: `import { useState } from 'react';
import { DatePicker, type DateRange } from '@lamsa-ui/react';

const [stay, setStay] = useState<DateRange | null>(null);

<DatePicker
  label="Stay"
  selection="range"
  rangeStartLabel="Check-in"
  rangeEndLabel="Check-out"
  value={stay}
  onChange={setStay}
/>`,
    vue: `<script setup lang="ts">
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
</template>`,
    html: `<label class="ui-field__label" for="stay-start">Stay</label>
<div class="ui-input-group">
  <input class="ui-input-group__input" id="stay-start" type="date" aria-label="Stay: Check-in" />
  <span class="ui-date-picker__separator" aria-hidden="true">–</span>
  <input class="ui-input-group__input" id="stay-end" type="date" aria-label="Stay: Check-out" />
  <button type="button" class="ui-input-group__button" aria-haspopup="dialog"
    aria-expanded="false" aria-label="Choose dates">
    <i class="ui-icon ui-icon-calendar"></i>
  </button>
</div>
<!-- Add a .ui-calendar with selection="range" to choose the dates together. -->`,
  };

  protected readonly date = {
    angular: `<ui-text-field
  label="Move-in date"
  type="date"
  min="2026-01-01"
  hint="Any day from January 2026."
  formControlName="moveIn"
/>`,
    react: `<TextField
  label="Move-in date"
  type="date"
  min="2026-01-01"
  hint="Any day from January 2026."
  value={moveIn}
  onChange={(e) => setMoveIn(e.target.value)}
/>`,
    vue: `<TextField
  label="Move-in date"
  type="date"
  min="2026-01-01"
  hint="Any day from January 2026."
  v-model="moveIn"
/>`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="move-in">Move-in date</label>
  <input class="ui-input" type="date" id="move-in" min="2026-01-01" aria-describedby="move-in-hint" />
  <p class="ui-field__hint" id="move-in-hint">Any day from January 2026.</p>
</div>`,
  };

  protected readonly time = {
    angular: `<!-- step in seconds: 900 offers quarter hours -->
<ui-text-field label="Delivery time" type="time" step="900" formControlName="time" />`,
    react: `<TextField label="Delivery time" type="time" step={900} />`,
    vue: `<TextField label="Delivery time" type="time" :step="900" />`,
    html: `<input class="ui-input" type="time" id="time" step="900" />`,
  };

  protected readonly number = {
    angular: `<ui-text-field label="Rooms" type="number" [min]="1" [max]="12" formControlName="rooms" />`,
    react: `<TextField
  label="Rooms"
  type="number"
  min={1}
  max={12}
  value={rooms ?? ''}
  onChange={(e) => setRooms(e.target.value === '' ? null : e.target.valueAsNumber)}
/>`,
    vue: `<!-- v-model holds the typed text; use Number(rooms) when you need the number -->
<TextField v-model="rooms" label="Rooms" type="number" min="1" max="12" />`,
    html: `<input class="ui-input" type="number" id="rooms" min="1" max="12" />`,
  };

  protected readonly arabic = {
    angular: `<ui-date-picker
  label="يوم التوصيل"
  locale="ar-EG"
  calendarLabel="اختر التاريخ"
  previousLabel="الشهر السابق"
  nextLabel="الشهر التالي"
  formControlName="day"
/>`,
    react: `<I18nProvider locale="ar-EG">
  <DatePicker label="يوم التوصيل" value={day} onChange={setDay} />
</I18nProvider>`,
    vue: `<I18nProvider locale="ar-EG">
  <DatePicker label="يوم التوصيل" v-model="day" />
</I18nProvider>`,
    html: `<!-- dir="rtl": the button sits on the left and the calendar runs right to left. -->`,
  };

  protected readonly nativeArabic = {
    angular: `<ui-text-field label="تاريخ الاستلام" type="date" formControlName="date" />`,
    react: `<TextField label="تاريخ الاستلام" type="date" />`,
    vue: `<TextField label="تاريخ الاستلام" type="date" />`,
    html: `<!-- dir="rtl" and lang="ar" on the page: the browser's picker follows -->`,
  };

  private readonly shared = [
    {
      name: 'label',
      type: 'string',
      description: 'Names the field and the calendar.',
    },
    {
      name: 'min | max',
      type: 'string',
      description: 'Earliest and latest dates, as YYYY-MM-DD.',
    },
    {
      name: 'isDisabled',
      type: '(date: string) => boolean',
      description: 'Days that cannot be picked, such as closed days.',
    },
    {
      name: 'hint | error',
      type: 'string',
      description: 'Help text, and the translated error that marks it invalid.',
    },
    {
      name: 'calendarLabel',
      type: 'string',
      default: 'Choose date',
      description: 'Names the calendar button. Translate it.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Pick days by looking at a month, or a range',
      use: 'Calendar',
      path: '/components/calendar',
    },
    {
      need: 'A time only',
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
        description: 'Shows one date field, or two fields for a date range.',
      },
      {
        name: 'range',
        type: 'DateRange | null',
        description:
          'Two-way model for range mode. start is an ISO date; end is null until the second date is picked.',
      },
      {
        name: 'rangeStartLabel | rangeEndLabel',
        type: 'string',
        default: "'Start date' | 'End date'",
        description: 'Accessible names for the two fields in range mode.',
      },
      {
        name: 'type (ui-text-field)',
        type: "'date' | 'time' | 'datetime-local' | 'number'",
        description:
          'Use the browser native picker for dates and times, or a basic number input.',
      },
      {
        name: 'min, max (ui-text-field)',
        type: 'string | number',
        description:
          "The range: '2026-01-31' for a date, '09:00' for a time, 1 for a number.",
      },
      {
        name: 'step (ui-text-field)',
        type: 'string | number',
        description: 'The steps: seconds for a time, units for a number.',
      },
      {
        name: 'locale',
        type: 'string',
        default: 'LOCALE_ID',
        description: "The calendar's month and day names.",
      },
      {
        name: 'previousLabel | nextLabel',
        type: 'string',
        description: "The calendar's month buttons. Translate them.",
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'selection',
        type: "'single' | 'range'",
        default: "'single'",
        description: 'Shows one date field, or two fields for a date range.',
      },
      {
        name: 'rangeStartLabel | rangeEndLabel',
        type: 'string',
        default: "'Start date' | 'End date'",
        description: 'Accessible names for the two fields in range mode.',
      },
      {
        name: 'type (TextField)',
        type: "'date' | 'time' | 'datetime-local' | 'number'",
        description:
          'Use the browser native picker for dates and times, or a basic number input.',
      },
      {
        name: 'min, max, step (TextField)',
        type: 'string | number',
        description:
          'Pass the native range and step attributes through to the input.',
      },
      {
        name: 'value | defaultValue | onChange',
        type: 'string | DateRange | null',
        description:
          'Controlled or starting value. Range mode takes two ISO dates. Language and order follow the nearest I18nProvider.',
      },
      {
        name: 'disabled | name',
        type: 'boolean | string',
        description: 'With name, the date is submitted with a form.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'selection',
        type: "'single' | 'range'",
        default: "'single'",
        description:
          'range types a start and an end date and picks both in the calendar.',
      },
      {
        name: 'rangeStartLabel | rangeEndLabel',
        type: 'string',
        description:
          'Accessible names of the two date inputs in a range; pass the translated text.',
      },
      {
        name: 'v-model',
        type: 'string | DateRange | null',
        description:
          'An ISO date ("2026-11-23"), or { start, end } for a range; null while incomplete.',
      },
      {
        name: 'disabled | name',
        type: 'boolean | string',
        description: 'As on any input.',
      },
    ],
    html: [
      {
        name: 'input.ui-input',
        type: 'element + class',
        description:
          'With type="date", "time", "datetime-local" or "number", inside a ui-field.',
      },
      {
        name: 'ui-input-group',
        type: 'class',
        description: 'The box around the date field and the calendar button.',
      },
      {
        name: 'ui-date-picker__popover',
        type: 'class',
        description: 'With ui-popover, the panel that holds the calendar.',
      },
    ],
  };
}
