import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NumberFieldComponent } from '@ghazal-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-number-field-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    NumberFieldComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Number field"
      lead="A number with − and + either side. Type it, in Latin or Arabic digits, or step it with the buttons, the arrow keys, or Page Up and Down for ten steps. On leaving the field it stays inside its limits and is written in the reader's language."
      [usage]="usage"
    >
      <app-example
        title="A quantity"
        description="The number is the one Tab stop; the buttons are for the pointer, as Up and Down do the same."
        [code]="basic"
      >
        <ui-number-field
          label="Guests"
          [min]="1"
          [max]="12"
          hint="Up to 12 at one table."
          class="doc-field"
          [formControl]="guests"
        />
      </app-example>

      <app-example
        title="Money"
        description="formatOptions takes any Intl number format: currency, units, or a fixed number of decimals."
        [code]="money"
      >
        <ui-number-field
          label="Budget"
          [min]="0"
          [step]="50"
          [formatOptions]="{ style: 'currency', currency: 'EGP' }"
          class="doc-field"
          [formControl]="budget"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-number-field
          label="عدد الضيوف"
          locale="ar-EG"
          decrementLabel="إنقاص"
          incrementLabel="زيادة"
          [min]="1"
          [max]="12"
          class="doc-field"
          [formControl]="guestsArabic"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class NumberFieldPageComponent {
  protected readonly guests = new FormControl<number | null>(2);
  protected readonly budget = new FormControl<number | null>(1500);
  protected readonly guestsArabic = new FormControl<number | null>(4);

  protected readonly usage = {
    angular: `import { NumberFieldComponent } from '@ghazal-ui/angular';
// The value is a number, or null when empty.`,
    react: `import { NumberField } from '@ghazal-ui/react';`,
    vue: `import { NumberField } from '@ghazal-ui/vue';`,
    html: `<div class="ui-field ui-number-field">...</div>`,
  };

  protected readonly basic = {
    angular: `<ui-number-field label="Guests" [min]="1" [max]="12" hint="Up to 12 at one table." formControlName="guests" />`,
    react: `<NumberField label="Guests" min={1} max={12} hint="Up to 12 at one table." value={guests} onChange={setGuests} />`,
    vue: `<NumberField label="Guests" :min="1" :max="12" hint="Up to 12 at one table." v-model="guests" />`,
    html: `<!-- Without a framework, a native number input steps and checks its limits itself. -->
<div class="ui-field ui-number-field">
  <label class="ui-field__label" for="guests">Guests</label>
  <div class="ui-input-group">
    <button type="button" class="ui-input-group__button" tabindex="-1" aria-label="Decrease"
      onclick="guests.stepDown()"><i class="ui-icon ui-icon-minus"></i></button>
    <input class="ui-input-group__input" id="guests" type="number" min="1" max="12" value="2" />
    <button type="button" class="ui-input-group__button" tabindex="-1" aria-label="Increase"
      onclick="guests.stepUp()"><i class="ui-icon ui-icon-plus"></i></button>
  </div>
</div>`,
  };

  protected readonly money = {
    angular: `<ui-number-field
  label="Budget"
  [min]="0"
  [step]="50"
  [formatOptions]="{ style: 'currency', currency: 'EGP' }"
  formControlName="budget"
/>`,
    react: `<NumberField
  label="Budget"
  min={0}
  step={50}
  formatOptions={{ style: 'currency', currency: 'EGP' }}
  value={budget}
  onChange={setBudget}
/>`,
    vue: `<NumberField
  label="Budget"
  :min="0"
  :step="50"
  :formatOptions="{ style: 'currency', currency: 'EGP' }"
  v-model="budget"
/>`,
    html: `<!-- Show the currency beside the number: -->
<span class="ui-input-group__addon">EGP</span>`,
  };

  protected readonly arabic = {
    angular: `<ui-number-field label="عدد الضيوف" locale="ar-EG" decrementLabel="إنقاص" incrementLabel="زيادة" [min]="1" [max]="12" />`,
    react: `<I18nProvider locale="ar-EG">
  <NumberField label="عدد الضيوف" min={1} max={12} />
</I18nProvider>`,
    vue: `<I18nProvider locale="ar-EG">
  <NumberField label="عدد الضيوف" :min="1" :max="12" />
</I18nProvider>`,
    html: `<!-- dir="rtl": − sits on the right, + on the left. -->`,
  };

  private readonly shared = [
    { name: 'label', type: 'string', description: 'Names the field.' },
    {
      name: 'min | max',
      type: 'number',
      description:
        'Limits. Stepping stops at them; typing is pulled back on leaving.',
    },
    {
      name: 'step',
      type: 'number',
      default: '1',
      description: 'One press. Page Up and Down move ten.',
    },
    {
      name: 'formatOptions',
      type: 'Intl.NumberFormatOptions',
      description:
        'Currency, units or decimals. With percent the value is the fraction, so step 0.01.',
    },
    {
      name: 'hint | error',
      type: 'string',
      description: 'Help text, and the translated error that marks it invalid.',
    },
    {
      name: 'decrementLabel | incrementLabel',
      type: 'string',
      default: 'Decrease | Increase',
      description: 'Names the buttons. Translate them.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A rough amount on a scale',
      use: 'Slider',
      path: '/components/slider',
    },
    {
      need: 'A code such as an ID or a card number',
      use: 'Text field',
      path: '/components/text-field',
    },
    {
      need: 'A price with a currency beside it',
      use: 'Input group',
      path: '/components/input-group',
    },
  ];

  protected readonly api = {
    angular: [
      ...this.shared,
      {
        name: 'locale',
        type: 'string',
        default: 'LOCALE_ID',
        description: 'Digits and separators: ar-EG writes Arabic digits.',
      },
    ],
    react: [
      ...this.shared,
      {
        name: 'value | defaultValue | onChange',
        type: 'number | null',
        description:
          'Controlled or starting number. The locale is the nearest I18nProvider.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'v-model',
        type: 'number | null',
        description: 'The number, or null when the field is empty.',
      },
    ],
    html: [
      {
        name: 'ui-number-field',
        type: 'class',
        description: 'On the field: centres the number between the buttons.',
      },
      {
        name: 'ui-input-group__button',
        type: 'class',
        description: 'The − and + buttons, out of the Tab order.',
      },
    ],
  };
}
