import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboboxComponent, type SelectOption } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

const COUNTRIES = [
  ['eg', 'Egypt', 'مصر'],
  ['sa', 'Saudi Arabia', 'السعودية'],
  ['ae', 'United Arab Emirates', 'الإمارات'],
  ['kw', 'Kuwait', 'الكويت'],
  ['qa', 'Qatar', 'قطر'],
  ['bh', 'Bahrain', 'البحرين'],
  ['om', 'Oman', 'عمان'],
  ['jo', 'Jordan', 'الأردن'],
  ['ma', 'Morocco', 'المغرب'],
  ['tn', 'Tunisia', 'تونس'],
  ['gb', 'United Kingdom', 'المملكة المتحدة'],
  ['us', 'United States', 'الولايات المتحدة'],
] as const;

@Component({
  selector: 'app-combobox-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    ComboboxComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Combobox"
      lead="A text field that filters a list as you type, for a long list such as countries. Focus stays in the field: arrow keys move through the matches, Enter picks one and Escape closes the list. The value is always one of the options."
      [usage]="usage"
    >
      <app-example title="Countries" [code]="basic">
        <ui-combobox
          label="Country"
          placeholder="Start typing"
          hint="Where the company is registered."
          [options]="countries"
          [formControl]="country"
          class="doc-field"
        />
      </app-example>

      <app-example title="With an error" [code]="error">
        <ui-combobox
          label="Country of birth"
          [options]="countries"
          [formControl]="birth"
          [error]="birth.invalid ? 'Choose a country' : undefined"
          class="doc-field"
        />
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        <ui-combobox
          label="الدولة"
          emptyText="مفيش نتايج"
          [options]="countriesAr"
          class="doc-field"
        />
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class ComboboxPageComponent {
  protected readonly countries: SelectOption<string>[] = COUNTRIES.map(
    ([value, label]) => ({ value, label }),
  );
  protected readonly countriesAr: SelectOption<string>[] = COUNTRIES.map(
    ([value, , label]) => ({ value, label }),
  );
  protected readonly country = new FormControl<string | null>('eg');
  protected readonly birth = new FormControl<string | null>(
    null,
    Validators.required,
  );

  protected readonly usage = {
    angular: `import { ComboboxComponent } from '@lamsa-ui/angular';
// Options are { value, label, disabled? }, as for ui-select. Add @angular/cdk/overlay-prebuilt.css.`,
    react: `import { Combobox } from '@lamsa-ui/react';`,
    vue: `import { Combobox } from '@lamsa-ui/vue';`,
    html: `<!-- A combobox needs script for the keyboard and the list. Use a framework package,
     or follow the WAI-ARIA combobox pattern with these classes: -->
<input class="ui-input" role="combobox" aria-expanded="true" aria-controls="list" />
<ul class="ui-listbox" role="listbox" id="list">
  <li class="ui-option ui-option--active" role="option" aria-selected="false">Egypt</li>
</ul>`,
  };

  protected readonly basic = {
    angular: `<ui-combobox
  label="Country"
  placeholder="Start typing"
  hint="Where the company is registered."
  [options]="countries"
  formControlName="country"
/>`,
    react: `<Combobox
  label="Country"
  placeholder="Start typing"
  hint="Where the company is registered."
  options={countries}
  value={country}
  onChange={setCountry}
/>`,
    vue: `<Combobox
  label="Country"
  placeholder="Start typing"
  hint="Where the company is registered."
  :options="countries"
  v-model="country"
/>`,
    html: `<!-- See "Use it": the markup a script should produce -->`,
  };

  protected readonly error = {
    angular: `<ui-combobox
  label="Country of birth"
  [options]="countries"
  formControlName="birth"
  [error]="form.controls.birth.invalid ? 'Choose a country' : undefined"
/>`,
    react: `<Combobox
  label="Country of birth"
  options={countries}
  value={birth}
  onChange={setBirth}
  error={birth ? undefined : 'Choose a country'}
/>`,
    vue: `<Combobox
  label="Country of birth"
  :options="countries"
  v-model="birth"
  :error="birth ? undefined : 'Choose a country'"
/>`,
    html: `<div class="ui-field ui-field--invalid">…</div>`,
  };

  protected readonly arabic = {
    angular: `<ui-combobox label="الدولة" emptyText="مفيش نتايج" [options]="countries" />`,
    react: `<Combobox label="الدولة" emptyText="مفيش نتايج" options={countries} />`,
    vue: `<Combobox label="الدولة" emptyText="مفيش نتايج" :options="countries" />`,
    html: `<!-- dir="rtl" on the page or any ancestor -->`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'One choice from fewer than about 10 options',
      use: 'Select',
      path: '/components/select',
    },
    {
      need: 'Several values',
      use: 'Chip input',
      path: '/components/chip-input',
    },
    {
      need: 'Find a page or run a command from anywhere',
      use: 'Command palette',
      path: '/components/command-palette',
    },
  ];

  protected readonly api = {
    angular: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the field and the list.',
      },
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        description:
          'Required. { value, label, disabled? }. The label is what is matched.',
      },
      {
        name: 'placeholder',
        type: 'string',
        description: 'Shown while the field is empty.',
      },
      {
        name: 'hint, error',
        type: 'string',
        description: 'As for the text field.',
      },
      {
        name: 'emptyText',
        type: 'string',
        default: "'No matches'",
        description:
          'Announced when nothing matches; pass the translated text.',
      },
      {
        name: 'compareWith',
        type: '(a: T, b: T) => boolean',
        default: '===',
        description:
          'How to match the form value to an option, for object values.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input; options get -option-<index>.',
      },
    ],
    react: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the field and the list.',
      },
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        description: 'Required. { value, label, disabled? }.',
      },
      {
        name: 'value, defaultValue',
        type: 'T | null',
        description: 'The chosen value, controlled or not.',
      },
      {
        name: 'onChange',
        type: '(value: T | null) => void',
        description:
          'Called with the picked value, or null when the field is emptied.',
      },
      {
        name: 'placeholder, hint, error',
        type: 'string',
        description: 'As for the text field.',
      },
      {
        name: 'emptyText',
        type: 'string',
        default: "'No matches'",
        description: 'Announced when nothing matches.',
      },
      { name: 'disabled', type: 'boolean', description: 'Disables the field.' },
      {
        name: 'name',
        type: 'string',
        description: 'Sends the value with a native form.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input; options get -option-<index>.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description: 'Required. Names the field and the list.',
      },
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        description: 'Required. { value, label, disabled? }.',
      },
      {
        name: 'v-model',
        type: 'T | null',
        description: 'The chosen value, controlled or not.',
      },
      {
        name: 'placeholder, hint, error',
        type: 'string',
        description: 'As for the text field.',
      },
      {
        name: 'emptyText',
        type: 'string',
        default: "'No matches'",
        description: 'Announced when nothing matches.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Disables the field.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Sends the value with a native form.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the input; options get -option-<index>.',
      },
    ],
    html: [
      {
        name: 'ui-input + role="combobox"',
        type: 'element',
        description:
          'The field, with aria-expanded, aria-controls and aria-activedescendant.',
      },
      {
        name: 'ui-listbox, ui-option, ui-option--active',
        type: 'class',
        description: 'The list, as for the select.',
      },
      {
        name: 'ui-listbox__empty',
        type: 'class',
        description: 'The "no matches" line, with role="status".',
      },
    ],
  };
}
