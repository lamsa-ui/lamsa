import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PhoneFieldComponent, type PhoneCountry } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-phone-field-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    PhoneFieldComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Phone field"
      lead="A phone number with its country code. The number reads left to right in every language, Arabic digits are welcome, and the 0 people type before a mobile number out of habit is dropped. What the form gets is one international number, ready to send a text to."
      [usage]="usage"
    >
      <app-example
        title="A mobile number"
        description="Type 010 1234 5678 and the form gets +201012345678."
        [code]="basic"
      >
        <div class="doc-field grid gap-2">
          <ui-phone-field
            label="Mobile"
            country="EG"
            hint="We text the delivery code here."
            [formControl]="phone"
          />
          <p class="text-text-muted ui-label" aria-live="polite">
            {{ phone.value ?? '—' }}
          </p>
        </div>
      </app-example>

      <app-example
        title="Your own list"
        description="Pass the countries you serve, with their names in the reader's language."
        [code]="list"
        [rtl]="true"
      >
        <ui-phone-field
          label="رقم الجوال"
          country="SA"
          countryLabel="رمز الدولة"
          class="doc-field"
          [countries]="gulf"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class PhoneFieldPageComponent {
  protected readonly phone = new FormControl<string | null>(null);
  protected readonly gulf: PhoneCountry[] = [
    { code: 'SA', dial: '+966', name: 'السعودية' },
    { code: 'AE', dial: '+971', name: 'الإمارات' },
    { code: 'KW', dial: '+965', name: 'الكويت' },
    { code: 'QA', dial: '+974', name: 'قطر' },
  ];

  protected readonly usage = {
    angular: `import { PhoneFieldComponent, PHONE_COUNTRIES } from '@lamsa-ui/angular';
// The value is an E.164 number such as +201012345678, or null.`,
    react: `import { PhoneField, PHONE_COUNTRIES } from '@lamsa-ui/react';`,
    vue: `import { PhoneField, PHONE_COUNTRIES } from '@lamsa-ui/vue';
// Bind one E.164 number with v-model, or null when empty.`,
    html: `<div class="ui-field ui-phone-field">...</div>`,
  };

  protected readonly basic = {
    angular: `<ui-phone-field label="Mobile" country="EG" hint="We text the delivery code here." formControlName="phone" />`,
    react: `<PhoneField label="Mobile" country="EG" hint="We text the delivery code here." value={phone} onChange={setPhone} />`,
    vue: `<PhoneField v-model="phone" label="Mobile" country="EG"
  hint="We text the delivery code here." />`,
    html: `<div class="ui-field ui-phone-field">
  <label class="ui-field__label" for="phone">Mobile</label>
  <div class="ui-input-group">
    <button class="ui-phone-field__country" aria-label="Country code: Egypt +20"
      aria-haspopup="listbox" aria-expanded="false"><span class="ui-phone-field__flag" aria-hidden="true">🇪🇬</span> Egypt +20</button>
    <input class="ui-input-group__input" id="phone" type="tel" inputmode="tel"
      autocomplete="tel-national" />
  </div>
  <!-- The country choices open in a popover listbox. -->
  <ul class="ui-listbox ui-phone-field__listbox" role="listbox" aria-label="Country code">
    <li class="ui-option" role="option" aria-selected="true"><span class="ui-phone-field__flag" aria-hidden="true">🇪🇬</span> Egypt +20</li>
    <li class="ui-option" role="option"><span class="ui-phone-field__flag" aria-hidden="true">🇸🇦</span> Saudi Arabia +966</li>
  </ul>
</div>`,
  };

  protected readonly list = {
    angular: `<ui-phone-field label="رقم الجوال" country="SA" countryLabel="رمز الدولة" [countries]="gulf" />

gulf: PhoneCountry[] = [
  { code: 'SA', dial: '+966', name: 'السعودية' },
  { code: 'AE', dial: '+971', name: 'الإمارات' },
];`,
    react: `<PhoneField label="رقم الجوال" country="SA" countryLabel="رمز الدولة" countries={gulf} />`,
    vue: `<PhoneField v-model="phone" label="رقم الجوال" country="SA"
  country-label="رمز الدولة" :countries="gulf" />`,
    html: `<!-- The box stays left to right inside an Arabic page; the label does not. -->`,
  };

  private readonly shared = [
    { name: 'label', type: 'string', description: 'Names the number.' },
    {
      name: 'country',
      type: 'string',
      default: 'EG',
      description:
        'The country picked at first, by ISO code. A stored number picks its own.',
    },
    {
      name: 'countries',
      type: 'PhoneCountry[]',
      default: 'PHONE_COUNTRIES',
      description:
        '{ code, dial, name }. ISO alpha-2 code supplies a flag. The Arab world first, then the most common elsewhere.',
    },
    {
      name: 'countryLabel',
      type: 'string',
      default: 'Country code from labels',
      description: 'Names the list for screen readers. Translate it.',
    },
    {
      name: 'hint | error | placeholder',
      type: 'string',
      description: 'Help text, the translated error, an example.',
    },
  ];

  protected readonly alternatives: Alternative[] = [
    {
      need: 'Any other number',
      use: 'Number field',
      path: '/components/number-field',
    },
    {
      need: 'A one-time code sent by SMS',
      use: 'PIN input',
      path: '/components/pin-input',
    },
  ];

  protected readonly api = {
    angular: this.shared,
    react: [
      ...this.shared,
      {
        name: 'value | defaultValue | onChange',
        type: 'string | null',
        description: 'Controlled or starting number, as E.164.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Submits the whole number with a form.',
      },
    ],
    vue: [
      ...this.shared,
      {
        name: 'modelValue | update:modelValue',
        type: 'string | null',
        description: 'The v-model number, controlled as E.164.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Submits the whole number with a form.',
      },
    ],
    html: [
      {
        name: 'ui-phone-field',
        type: 'class',
        description: 'On the field: the box reads left to right.',
      },
      {
        name: 'ui-phone-field__country',
        type: 'class',
        description: 'A country-picker trigger inside the box.',
      },
    ],
  };
}
