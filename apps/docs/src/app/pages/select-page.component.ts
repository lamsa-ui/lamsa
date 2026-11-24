import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent, type SelectOption } from '@lamsa-ui/angular';
import { ApiTableComponent } from '../shared/api-table.component';
import {
  AlternativesComponent,
  type Alternative,
} from '../shared/alternatives.component';
import { DocsSettings } from '../shared/docs-settings';
import { ExampleComponent } from '../shared/example.component';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-select-page',
  imports: [
    PageComponent,
    ExampleComponent,
    ApiTableComponent,
    AlternativesComponent,
    SelectComponent,
    ReactiveFormsModule,
  ],
  template: `
    <app-page
      title="Select"
      lead="One choice from a list. Arrow keys, Home and End, and typing the first letters all move through the options; Escape and Tab close the list and return focus."
      [usage]="usage"
    >
      @if (settings.framework() === 'html') {
        <p class="doc-note">
          Without a framework, use the native select with the
          <code>ui-input</code> class. The browser gives it keyboard and screen
          reader support for free. The custom list needs the behaviour that the
          framework packages add.
        </p>
      }

      <app-example title="Basic" [code]="basic">
        @if (settings.framework() === 'html') {
          <div class="ui-field doc-field">
            <label class="ui-field__label" for="doc-city">City</label>
            <select class="ui-input" id="doc-city">
              <option value="">Choose a city</option>
              @for (c of cities; track c.value) {
                <option [value]="c.value">{{ c.label }}</option>
              }
            </select>
          </div>
        } @else {
          <ui-select
            label="City"
            placeholder="Choose a city"
            [options]="cities"
            [formControl]="city"
            class="doc-field"
          />
        }
      </app-example>

      <app-example title="With an error" [code]="error">
        @if (settings.framework() === 'html') {
          <div class="ui-field doc-field">
            <label class="ui-field__label" for="doc-size">Size</label>
            <select
              class="ui-input"
              id="doc-size"
              aria-invalid="true"
              aria-describedby="doc-size-error"
            >
              <option value="">Choose a size</option>
              @for (s of sizes; track s.value) {
                <option [value]="s.value" [disabled]="s.disabled">
                  {{ s.label }}
                </option>
              }
            </select>
            <p class="ui-field__error" id="doc-size-error" role="alert">
              Choose a size
            </p>
          </div>
        } @else {
          <ui-select
            label="Size"
            placeholder="Choose a size"
            [options]="sizes"
            [formControl]="size"
            error="Choose a size"
            class="doc-field"
          />
        }
      </app-example>

      <app-example title="In Arabic" [rtl]="true" [code]="arabic">
        @if (settings.framework() === 'html') {
          <div class="ui-field doc-field">
            <label class="ui-field__label" for="doc-city-ar">المدينة</label>
            <select class="ui-input" id="doc-city-ar">
              @for (c of citiesAr; track c.value) {
                <option [value]="c.value">{{ c.label }}</option>
              }
            </select>
          </div>
        } @else {
          <ui-select
            label="المدينة"
            placeholder="اختار المدينة"
            [options]="citiesAr"
            [formControl]="cityAr"
            class="doc-field"
          />
        }
      </app-example>

      <app-alternatives [rows]="alternatives" />
      <app-api-table [rows]="api" />
    </app-page>
  `,
})
export class SelectPageComponent {
  protected readonly settings = inject(DocsSettings);
  protected readonly city = new FormControl<string | null>(null);
  protected readonly size = new FormControl<string | null>(null);
  protected readonly cityAr = new FormControl<string | null>(null);

  protected readonly cities: SelectOption<string>[] = [
    { value: 'cai', label: 'Cairo' },
    { value: 'alx', label: 'Alexandria' },
    { value: 'gzh', label: 'Giza' },
    { value: 'asw', label: 'Aswan' },
  ];
  protected readonly sizes: SelectOption<string>[] = [
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large', disabled: true },
  ];
  protected readonly citiesAr: SelectOption<string>[] = [
    { value: 'cai', label: 'القاهرة' },
    { value: 'alx', label: 'الإسكندرية' },
    { value: 'gzh', label: 'الجيزة' },
  ];

  protected readonly usage = {
    react: `import { Select, type SelectOption } from '@lamsa-ui/react';`,
    vue: `import { Select, type SelectOption } from '@lamsa-ui/vue';`,
    angular: `import { SelectComponent, type SelectOption } from '@lamsa-ui/angular';
// Works with formControlName, [formControl] and ngModel.`,
    html: `<select class="ui-input" id="city">...</select>`,
  };

  protected readonly basic = {
    react: `const cities: SelectOption<string>[] = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
];
const [city, setCity] = useState<string | null>(null);

<Select
  label="City"
  placeholder="Choose a city"
  options={cities}
  value={city}
  onChange={setCity}
/>`,
    vue: `<script setup lang="ts">
import { Select, type SelectOption } from '@lamsa-ui/vue';
import { ref } from 'vue';

const cities: SelectOption[] = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
];
const city = ref<string | null>(null);
</script>

<template>
  <Select v-model="city" label="City" placeholder="Choose a city" :options="cities" />
</template>`,
    angular: `cities: SelectOption<string>[] = [
  { value: 'cai', label: 'Cairo' },
  { value: 'alx', label: 'Alexandria' },
];

<ui-select label="City" placeholder="Choose a city" [options]="cities" formControlName="city" />`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="city">City</label>
  <select class="ui-input" id="city">
    <option value="">Choose a city</option>
    <option value="cai">Cairo</option>
    <option value="alx">Alexandria</option>
  </select>
</div>`,
  };

  protected readonly error = {
    react: `const sizes: SelectOption<string>[] = [
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large', disabled: true },
];

<Select label="Size" options={sizes} error="Choose a size" />`,
    vue: `const sizes: SelectOption<string>[] = [
  {{ value: 's', label: 'Small' }},
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large', disabled: true },
];

<Select label="Size" :options="sizes" error="Choose a size" />`,
    angular: `sizes: SelectOption<string>[] = [
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large', disabled: true },
];

<ui-select label="Size" [options]="sizes" formControlName="size" error="Choose a size" />`,
    html: `<div class="ui-field">
  <label class="ui-field__label" for="size">Size</label>
  <select class="ui-input" id="size" aria-invalid="true" aria-describedby="size-error">
    <option value="">Choose a size</option>
    <option value="s">Small</option>
    <option value="m">Medium</option>
    <option value="l" disabled>Large</option>
  </select>
  <p class="ui-field__error" id="size-error" role="alert">Choose a size</p>
</div>`,
  };

  protected readonly arabic = {
    react: `{/* dir="rtl" on the page or any ancestor */}
<Select label="المدينة" placeholder="اختار المدينة" options={cities} />`,
    vue: `<!-- dir="rtl" on the page or any ancestor -->
<Select label="المدينة" placeholder="اختار المدينة" :options="cities" />`,
    angular: `<!-- dir="rtl" on the page or any ancestor -->
<ui-select label="المدينة" placeholder="اختار المدينة" [options]="cities" formControlName="city" />`,
    html: `<!-- dir="rtl" on the page or any ancestor -->
<div class="ui-field">
  <label class="ui-field__label" for="city">المدينة</label>
  <select class="ui-input" id="city">
    <option value="cai">القاهرة</option>
    <option value="alx">الإسكندرية</option>
  </select>
</div>`,
  };

  protected readonly alternatives: Alternative[] = [
    {
      need: 'A long list the reader searches',
      use: 'Combobox',
      path: '/components/combobox',
    },
    {
      need: 'Two to five options that fit on screen',
      use: 'Radio group',
      path: '/components/radio-group',
    },
    { need: 'Actions, not values', use: 'Menu', path: '/components/menu' },
  ];

  protected readonly api = {
    react: [
      {
        name: 'label',
        type: 'string',
        description:
          'Required. The visible label; it names the button and the list.',
      },
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        description:
          'Required. { value, label, disabled? } for each option; value is a string or number.',
      },
      {
        name: 'value / defaultValue',
        type: 'T | null',
        description: 'The chosen value, controlled or not.',
      },
      {
        name: 'onChange',
        type: '(value: T) => void',
        description: 'Called with the value of the picked option.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        description: 'Shown while nothing is chosen.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the field invalid and announces the message.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the select.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Field name, so the value is sent with a native form.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the button; options get -option-<index>.',
      },
    ],
    vue: [
      {
        name: 'label',
        type: 'string',
        description:
          'Required. The visible label; it names the button and the list.',
      },
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        description:
          'Required. { value, label, disabled? } for each option; value is a string or number.',
      },
      {
        name: 'v-model',
        type: 'T | null',
        description: 'The chosen value, controlled or not.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        description: 'Shown while nothing is chosen.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the field invalid and announces the message.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the select.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Field name, so the value is sent with a native form.',
      },
      {
        name: 'testId',
        type: 'string',
        description: 'data-testid on the button; options get -option-<index>.',
      },
    ],
    angular: [
      {
        name: 'label',
        type: 'string',
        description:
          'Required. The visible label; it names the button and the list.',
      },
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        description: 'Required. { value, label, disabled? } for each option.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        description: 'Shown while nothing is chosen.',
      },
      {
        name: 'error',
        type: 'string',
        description:
          'The translated error. Marks the select invalid and announces the message.',
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
        description: 'data-testid on the button; options get -option-<index>.',
      },
    ],
    html: [
      {
        name: 'select.ui-input',
        type: 'element + class',
        description:
          'A native select inside a ui-field, with a label as for the text field.',
      },
      {
        name: 'aria-invalid="true"',
        type: 'attribute',
        description:
          'With a ui-field__error message listed in aria-describedby.',
      },
    ],
  };
}
